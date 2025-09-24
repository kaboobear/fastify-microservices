import { FastifyInstance } from "fastify";
import { AuthRepository } from "../repository/auth.repository";
import { UsersClient } from "../clients/users-client";
import { geteratePasswordHash, verifyPassword } from "../helpers/password";
import { scopesForRole } from "../helpers/permissions";
import {
  EmailTakenError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
} from "../helpers/errors/AppError";

export class AuthService {
  constructor(
    private fastify: FastifyInstance,
    private usersClient = new UsersClient(fastify),
    private repository = new AuthRepository(fastify)
  ) {}

  async register(
    email: string,
    name: string,
    password: string,
    correlationId: string,
    requestId: string
  ) {
    const existingAuthRecord = await this.repository.findByEmail(email);
    if (existingAuthRecord) throw new EmailTakenError(email);

    const { id: userId } = await this.usersClient.createUser({
      email,
      name,
      correlationId,
      requestId,
    });

    const passwordHash = await geteratePasswordHash(password);
    const refreshToken = this.fastify.generateRefreshToken();
    const refreshTokenHash = this.fastify.hashRefreshToken(refreshToken);

    const createdAuthRecord = await this.repository.create({
      email,
      passwordHash,
      refreshTokenHash,
      userId,
    });

    const scopes = scopesForRole(createdAuthRecord.role);
    const accessToken = this.fastify.signUserToken({ sub: String(userId), email, scopes });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.fastify.prisma.auth.findFirst({ where: { email } });
    if (!user) throw new InvalidCredentialsError();

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) throw new InvalidCredentialsError();

    const scopes = scopesForRole(user.role);
    const accessToken = this.fastify.signUserToken({ sub: String(user.user_id), email, scopes });
    const refreshToken = this.fastify.generateRefreshToken();
    const refreshTokenHash = this.fastify.hashRefreshToken(refreshToken);

    await this.repository.updateRefreshHash(user.id, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(email: string, refreshToken: string) {
    const user = await this.repository.findByEmail(email);
    const refreshTokenHash = this.fastify.hashRefreshToken(refreshToken);

    if (!user || user.refresh_token_hash !== refreshTokenHash) {
      throw new InvalidRefreshTokenError();
    }

    const scopes = scopesForRole(user.role);
    const accessToken = this.fastify.signUserToken({ sub: String(user.user_id), email, scopes });
    const newRefreshToken = this.fastify.generateRefreshToken();
    const newRefreshTokenHash = this.fastify.hashRefreshToken(newRefreshToken);

    await this.repository.updateRefreshHash(user.id, newRefreshTokenHash);

    return { accessToken, newRefreshToken };
  }

  async logout(email: string, refreshToken: string) {
    const user = await this.repository.findByEmail(email);
    const refreshTokenHash = this.fastify.hashRefreshToken(refreshToken);

    if (!user || user.refresh_token_hash !== refreshTokenHash) {
      return { ok: true };
    }

    const newRefreshToken = this.fastify.generateRefreshToken();
    const newRefreshTokenHash = this.fastify.hashRefreshToken(newRefreshToken);

    await this.repository.updateRefreshHash(user.id, newRefreshTokenHash);
    return { ok: true };
  }
}
