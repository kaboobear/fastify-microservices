import { FastifyInstance } from "fastify";

export class ProductsRepository {
  constructor(private fastify: FastifyInstance) {}

  create(data: { title: string; description: string; price: number; stock: number }) {
    return this.fastify.prisma.product.create({ data });
  }

  listAll() {
    return this.fastify.prisma.product.findMany();
  }
}
