import { FastifyInstance } from "fastify";
import { CreateProductBodySchema } from "../schemas/user.schema";
import { ProductsService } from "../services/products.service";

export default async function productsController(fastify: FastifyInstance) {
  const service = new ProductsService(fastify);

  fastify.get(
    "/",
    { preHandler: [fastify.authUser, fastify.authorize({ any: ["users:read"] })] },
    async (request, reply) => {
      const products = await service.listAll();

      return reply.send(products);
    }
  );

  fastify.post(
    "/",
    { preHandler: [fastify.authUser, fastify.authorize({ any: ["users:write"] })] },
    async (request, reply) => {
      const { title, description, price, stock } = CreateProductBodySchema.parse(request.body);
      const createdProduct = await service.create({ title, description, price, stock });

      return reply.status(201).send(createdProduct);
    }
  );
}
