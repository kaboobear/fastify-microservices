import { FastifyInstance } from "fastify";
import { LoginSchema, RefreshSchema, RegisterSchema } from "../schemas/auth.schemas";
import { AuthService } from "../services/auth.services";

export default async function authController(fastify: FastifyInstance) {
  const service = new AuthService(fastify);

  fastify.post("/register", async (request, reply) => {
    const { email, password, name } = RegisterSchema.parse(request.body);
    const { correlationId, requestId } = request;
    const { accessToken, refreshToken } = await service.register(
      email,
      name,
      password,
      correlationId,
      requestId
    );

    return reply.send({ access_token: accessToken, refresh_token: refreshToken });
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = LoginSchema.parse(request.body);
    const { accessToken, refreshToken } = await service.login(email, password);

    return reply.send({ access_token: accessToken, refresh_token: refreshToken });
  });

  fastify.post("/refresh", async (request, reply) => {
    const { email, refresh_token } = RefreshSchema.parse(request.body);
    const { accessToken, newRefreshToken } = await service.refresh(email, refresh_token);

    return reply.send({ access_token: accessToken, refresh_token: newRefreshToken });
  });

  fastify.post("/logout", async (request, reply) => {
    const { email, refresh_token } = RefreshSchema.parse(request.body);
    const response = await service.logout(email, refresh_token);

    return reply.send(response);
  });

  fastify.get(
    "/me",
    { preHandler: [fastify.authUser, fastify.authorize({ any: ["users:read"] })] },
    (request) => request.user
  );
}
