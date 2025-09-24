import { z } from "zod";

const EmailString = z.string().trim().toLowerCase().pipe(z.string().email("Invalid email format"));

export const CreateUserBodySchema = z.object({
  email: EmailString,
  name: z.string().trim().min(1, "Name is required"),
});

export const RetrieveUserByIdParamsSchema = z.object({
  id: z.coerce.number({ error: "Id is required" }).int().positive(),
});
