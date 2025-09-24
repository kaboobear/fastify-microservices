import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import authController from "./controllers/auth.controller";
import { globalErrorHandler } from "./helpers/errors/globalErrorHandler.helper";
import { env } from "./config";
import fastifyJwt from "@fastify/jwt";
import correlationPlugin from "./plugins/corellation";
import healthController from "./controllers/health.controller";

const fastify = Fastify({
  logger: true,
  ignoreTrailingSlash: true,
});

fastify.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "15m",
  },
});
fastify.register(authPlugin);
fastify.register(correlationPlugin);
fastify.register(prismaPlugin);
fastify.register(healthController, { prefix: "/auth" });
fastify.register(authController, { prefix: "/auth" });
fastify.setErrorHandler(globalErrorHandler(fastify));

const start = async () => {
  try {
    await fastify.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log("Auth-service is running on port", env.PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
