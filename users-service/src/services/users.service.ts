import { FastifyInstance } from "fastify";
import { UsersRepository } from "../repositories/users.repository";

export class UsersService {
  constructor(
    private fastify: FastifyInstance,
    private repository = new UsersRepository(fastify)
  ) {}

  create(data: { name: string; email: string }) {
    return this.repository.create(data);
  }

  listAll() {
    return this.repository.listAll();
  }

  retrieveById(id: number) {
    return this.repository.retrieveById(id);
  }
}
