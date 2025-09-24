import { ProductsService } from "./products.service";

describe("ProductsService", () => {
  const fastifyMock: any = {};
  const repository = {
    create: jest.fn(),
    listAll: jest.fn(),
  } as any;

  let service: ProductsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductsService(fastifyMock, repository);
  });

  it("create() delegates to repository and returns created entity", async () => {
    const input = { title: "T", description: "D", price: 10, stock: 2 };
    const created = { id: 1, ...input };
    repository.create.mockResolvedValue(created);

    const result = await service.create(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(created);
  });

  it("listAll() delegates to repository", async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    repository.listAll.mockResolvedValue(rows);

    const result = await service.listAll();

    expect(repository.listAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(rows);
  });
});
