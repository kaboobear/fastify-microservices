import fp from "fastify-plugin";
import crypto from "crypto";
import { hasScopes } from "../helpers/permissions";

export default fp(async (fastify) => {
  if (!fastify.jwt) throw new Error("@fastify/jwt must be registered before auth plugin");

  fastify.decorate("signUserToken", (claims: { sub: string; email: string; scopes: string[] }) =>
    fastify.jwt.sign({ typ: "user", ...claims })
  );

  fastify.decorate("signServiceToken", () => fastify.jwt.sign({ typ: "service" }));

  fastify.decorate("generateRefreshToken", () => crypto.randomUUID());

  fastify.decorate("hashRefreshToken", (refreshToken: string) =>
    crypto.createHash("sha256").update(refreshToken, "utf8").digest("hex")
  );

  fastify.decorate("authUser", async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
      if (req.user?.typ === "service")
        return reply.code(403).send({ error: "User token required" });
      req.auth = req.user;
    } catch {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });

  fastify.decorate("authService", async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
      if (req.user?.typ !== "service")
        return reply.code(403).send({ error: "Service token required" });
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
