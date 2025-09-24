import { FastifyInstance } from "fastify";
import { CreateUserBodySchema, RetrieveUserByIdParamsSchema } from "../schemas/user.schema";
import { UsersService } from "../services/users.service";
import { UserNotFoundError } from "../helpers/errors/AppError";

export default async function usersController(fastify: FastifyInstance) {
  const service = new UsersService(fastify);

  fastify.post("/", { preHandler: fastify.authService }, async (request, reply) => {
    const { name, email } = CreateUserBodySchema.parse(request.body);
    const createdUser = await service.create({ name, email });

    return reply.status(201).send(createdUser);
  });

  fastify.get(
    "/",
    { preHandler: [fastify.authUser, fastify.authorize({ any: ["users:read"] })] },
    async (request, reply) => {
      const users = await service.listAll();
      return reply.send(users);
    }
  );

  fastify.get(
    "/:id",
    { preHandler: [fastify.authUser, fastify.authorize({ any: ["users:read"] })] },
    async (request, reply) => {
      const { id } = RetrieveUserByIdParamsSchema.parse(request.params);
      const user = await service.retrieveById(id);

      if (!user) throw new UserNotFoundError(id);

      return reply.send(user);
    }
  );
}
