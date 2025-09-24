import Fastify from "fastify";
import productsController from "./products.controller";
import { globalErrorHandler } from "../helpers/globalErrorHandler.helper";

const listAllMock = jest.fn();
const createMock = jest.fn();

jest.mock("../services/products.service", () => {
  return {
    ProductsService: jest.fn().mockImplementation(() => ({
      listAll: listAllMock,
      create: createMock,
    })),
  };
});

function buildApp(userScopes: string[] = []) {
  const app: any = Fastify({ logger: false });

  app.decorate("authUser", async function (req: any) {
    const auth = req.headers["authorization"] as string | undefined;
    if (!auth || !auth.startsWith("Bearer ")) {
      const err: any = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    req.user = {
      sub: "u1",
      scopes: userScopes ?? ["users:read", "users:write"],
    };
  });

  app.decorate("authorize", function ({ any }: { any: string[] }) {
    return async function (req: any) {
      const user = req.user;
      const hasAny =
        Array.isArray(user?.scopes) && any.some((scope) => user.scopes.includes(scope));
      if (!hasAny) {
        const err: any = new Error("Forbidden");
        err.statusCode = 403;
        throw err;
      }
    };
  });

  app.setErrorHandler(globalErrorHandler(app));
  app.register(productsController, { prefix: "/products" });

  return app;
}

describe("productsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /products → 401 when missing Authorization header", async () => {
    const app = buildApp();
    await app.ready();

    const response = await app.inject({ method: "GET", url: "/products" });

    expect(response.statusCode).toBe(401);
    expect(response.json().error.status).toBe(401);

    await app.close();
  });

  test("GET /products → 403 when lacking users:read scope", async () => {
    const app = buildApp(["users:write"]);
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/products",
      headers: { authorization: "Bearer test" },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().error.status).toBe(403);

    await app.close();
  });

  it("GET /products returns 200 and list", async () => {
    const app = buildApp(["users:read"]);
    await app.ready();

    listAllMock.mockResolvedValue([{ id: 1, title: "A" }]);

    const response = await app.inject({
      method: "GET",
      url: "/products",
      headers: { authorization: "Bearer test" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([{ id: 1, title: "A" }]);

    await app.close();
  });

  it("POST /products returns 201 on success", async () => {
    const app = buildApp(["users:write"]);
    await app.ready();

    const input = { title: "T", description: "D", price: 9.99, stock: 2 };
    const created = { id: 10, ...input };
    createMock.mockResolvedValue(created);

    const response = await app.inject({
      method: "POST",
      url: "/products",
      payload: input,
      headers: { authorization: "Bearer test" },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(created);
    expect(createMock).toHaveBeenCalledWith(input);

    await app.close();
  });

  test("POST /products → 403 when lacking users:write scope", async () => {
    const app = buildApp(["users:read"]);
    await app.ready();

    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: "Bearer test" },
      payload: { title: "T", description: "D", price: 9.99, stock: 2 },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().error.status).toBe(403);

    await app.close();
  });

  it("POST /products returns 400 on validation error (Zod)", async () => {
    const app = buildApp(["users:write"]);
    await app.ready();

    const res = await app.inject({
      method: "POST",
      url: "/products",
      payload: { title: "T" },
      headers: { authorization: "Bearer test" },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("VALIDATION_ERROR");

    await app.close();
  });
});
