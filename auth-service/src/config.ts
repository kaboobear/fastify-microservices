import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().refine((val) => !Number.isNaN(val), { message: "PORT is required" }),
  DB_URL: z.string().min(1, "DB_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  USERS_SERVICE_BASE: z.string().min(1, "USERS_SERVICE_BASE is required"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = EnvSchema.parse(process.env);
