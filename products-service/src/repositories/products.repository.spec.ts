import { ProductsRepository } from "./products.repository";

describe("ProductsRepository", () => {
  const fastifyMock = {
    prisma: {
      product: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    },
  } as any;

  const repository = new ProductsRepository(fastifyMock);

  beforeEach(() => jest.clearAllMocks());

  it("create(): forwards data to prisma and returns created entity", async () => {
    const input = { title: "T", description: "D", price: 10, stock: 2 };
    const created = { id: 1, ...input };
    fastifyMock.prisma.product.create.mockResolvedValue(created);

    const response = await repository.create(input);
    expect(response).toEqual(created);
    expect(fastifyMock.prisma.product.create).toHaveBeenCalledWith({ data: input });
  });

  it("listAll(): returns array", async () => {
    fastifyMock.prisma.product.findMany.mockResolvedValue([{ id: 1 }]);
    const res = await repository.listAll();
    expect(res).toEqual([{ id: 1 }]);
  });
});
