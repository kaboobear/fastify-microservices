import { z } from "zod";

const EmailString = z.string().trim().toLowerCase().pipe(z.string().email("Invalid email format"));
const UUIDString = z.string().pipe(z.string().uuid("Invalid UUID format"));

export const RegisterSchema = z.object({
  email: EmailString,
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().min(1, "Name is required"),
});

export const LoginSchema = z.object({
  email: EmailString,
  password: z.string().min(1, "Password is required"),
});

export const RefreshSchema = z.object({
  email: EmailString,
  refresh_token: UUIDString,
});
