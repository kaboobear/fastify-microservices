import { FastifyInstance } from "fastify";

export class UsersRepository {
  constructor(private fastify: FastifyInstance) {}

  create(data: { name: string; email: string }) {
    return this.fastify.prisma.user.create({ data });
  }

  listAll() {
    return this.fastify.prisma.user.findMany();
  }

  retrieveById(id: number) {
    return this.fastify.prisma.user.findFirst({ where: { id } });
  }
}
