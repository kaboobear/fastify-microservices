import fp from "fastify-plugin";
import { hasScopes } from "../helpers/permissions";

export default fp(async (fastify) => {
  if (!fastify.jwt) throw new Error("@fastify/jwt must be registered before auth plugin");

  fastify.decorate("authUser", async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
      if (req.user?.typ === "service") {
        return reply.code(403).send({ error: "User token required" });
      }
      req.auth = req.user;
    } catch {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });

  fastify.decorate("authorize", (opts: { all?: string[]; any?: string[] } = {}) => {
    return async function (req: any, reply: any) {
      const user = req.user;
      if (!user) return reply.code(401).send({ error: "Unauthorized" });

      if (!hasScopes(user.scopes, opts.all, opts.any)) {
        return reply.code(403).send({ error: "Forbidden" });
      }
    };
  });
});
