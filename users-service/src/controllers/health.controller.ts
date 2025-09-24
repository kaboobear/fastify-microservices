import { FastifyInstance } from "fastify";

export default async function healthController(fastify: FastifyInstance) {
  fastify.get("/health", async () => {
    return { status: "ok" };
  });

  fastify.get("/ready", async () => {
    try {
      await fastify.prisma.$queryRaw`SELECT 1`;
      return { status: "ready" };
    } catch (err) {
      return { status: "not-ready", error: "Database unreachable" };
    }
  });
}
