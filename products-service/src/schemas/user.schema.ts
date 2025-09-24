import { z } from "zod";

export const CreateProductBodySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.number({ error: "Price is required" }).min(0, "Price must be at least 0"),
  stock: z.number({ error: "Stock is required" }).min(0, "Stock must be at least 0"),
});
