import Fastify from "fastify";
import productsController from "./controllers/products.controller";
import prismaPlugin from "./plugins/prisma";
import fastifyJwt from "@fastify/jwt";
import authPlugin from "./plugins/auth";
import { env } from "./config";
import { globalErrorHandler } from "./helpers/globalErrorHandler.helper";
import correlationPlugin from "./plugins/corellation";
import healthController from "./controllers/health.controller";

const fastify = Fastify({ logger: true, ignoreTrailingSlash: true });

fastify.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
fastify.register(authPlugin);
fastify.register(correlationPlugin);
fastify.register(prismaPlugin);
fastify.register(productsController, { prefix: "/products" });
fastify.register(healthController, { prefix: "/products" });
fastify.setErrorHandler(globalErrorHandler(fastify));

const start = async () => {
  try {
    await fastify.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log("Products-service is running on port", env.PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
