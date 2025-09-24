import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    auth?: {
      sub: string;
      email?: string;
      typ?: "user" | "service";
      scopes?: string[];
      iat?: number;
      exp?: number;
    };
  }
  interface FastifyInstance {
    signUserToken: (claims: { sub: string; email: string; scopes: string[] }) => string;
    signServiceToken: () => string;
    generateRefreshToken: () => string;
    hashRefreshToken: (refreshToken: string) => string;
    authUser: (req: any, reply: any) => Promise<void>;
    authService: (req: any, reply: any) => Promise<void>;
    authorize: (opts: {
      all?: string[];
      any?: string[];
    }) => (req: any, reply: any) => Promise<void>;
  }
}
