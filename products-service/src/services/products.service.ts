import { FastifyInstance } from "fastify";
import { ProductsRepository } from "../repositories/products.repository";

export class ProductsService {
  constructor(
    private fastify: FastifyInstance,
    private repository = new ProductsRepository(fastify)
  ) {}

  create(data: { title: string; description: string; price: number; stock: number }) {
    return this.repository.create(data);
  }

  listAll() {
    return this.repository.listAll();
  }
}
