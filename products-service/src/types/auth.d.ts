import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    auth?: {
      sub: string;
      email?: string;
      scopes?: string[];
      typ?: "user" | "service";
      iat?: number;
      exp?: number;
    };
  }
  interface FastifyInstance {
    authUser: (req: any, reply: any) => Promise<void>;
    authorize: (opts: {
      all?: string[];
      any?: string[];
    }) => (req: any, reply: any) => Promise<void>;
  }
}
