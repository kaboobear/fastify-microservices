import Fastify from "fastify";
import usersController from "./controllers/users.controller";
import prismaPlugin from "./plugins/prisma";
import { env } from "./config";
import fastifyJwt from "@fastify/jwt";
import authPlugin from "./plugins/auth";
import correlationPlugin from "./plugins/corellation";
import { globalErrorHandler } from "./helpers/errors/globalErrorHandler.helper";
import healthController from "./controllers/health.controller";

const fastify = Fastify({ logger: true, ignoreTrailingSlash: true });

fastify.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
fastify.register(authPlugin);
fastify.register(correlationPlugin);
fastify.register(prismaPlugin);
fastify.register(usersController, { prefix: "/users" });
fastify.register(healthController, { prefix: "/users" });
fastify.setErrorHandler(globalErrorHandler(fastify));

const start = async () => {
  try {
    await fastify.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log("Users-service is running on port", env.PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
