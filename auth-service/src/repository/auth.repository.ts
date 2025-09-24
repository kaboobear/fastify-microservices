import { FastifyInstance } from "fastify";

export class AuthRepository {
  constructor(private fastify: FastifyInstance) {}

  findByEmail(email: string) {
    return this.fastify.prisma.auth.findFirst({ where: { email } });
  }

  updateRefreshHash(id: number, refreshTokenHash: string) {
    return this.fastify.prisma.auth.update({
      where: { id },
      data: { refresh_token_hash: refreshTokenHash },
    });
  }

  create({
    email,
    passwordHash,
    refreshTokenHash,
    userId,
  }: {
    email: string;
    passwordHash: string;
    refreshTokenHash: string;
    userId: number;
  }) {
    return this.fastify.prisma.auth.create({
      data: {
        email,
        user_id: userId,
        password_hash: passwordHash,
        refresh_token_hash: refreshTokenHash,
      },
    });
  }
}
