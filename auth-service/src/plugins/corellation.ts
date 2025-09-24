import fp from "fastify-plugin";
import crypto from "crypto";

declare module "fastify" {
  interface FastifyRequest {
    correlationId: string;
    requestId: string;
  }
}

export default fp((app) => {
  app.addHook("onRequest", async (req, reply) => {
    const requestId = crypto.randomUUID();

    const incomingCorrelationId = Array.isArray(req.headers["x-correlation-id"])
      ? req.headers["x-correlation-id"][0]
      : req.headers["x-correlation-id"];
    const correlationId = incomingCorrelationId || requestId;

    req.requestId = requestId;
    req.correlationId = correlationId;

    reply.header("x-request-id", requestId);
    reply.header("x-correlation-id", correlationId);

    req.log = req.log.child({ requestId, correlationId });
  });
});
