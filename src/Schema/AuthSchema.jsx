import { z } from "zod";

export const RegistrationSchema = z
  .object({
    name: z
      .string()
      .min(3, "name must be at least 3 characters")
      .max(20, "name must be at most 20 characters"),
    username: z
      .string()
      .min(3, "username must be at least 3 characters")
      .max(20, "username must be at most 20 characters"),
    email: z
      .string()
      .email("invalid email format")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "invalid email format",
      ),
    password: z
      .string()
      .min(6, "password must be at least 6 characters")
      .max(20, "password must be at most 20 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    rePassword: z
      .string()
      .min(3, "re-password must be at least 3 characters")
      .max(20, "re-password must be at most 20 characters"),
    dateOfBirth: z.string().refine((value) => new Date(value) < new Date(), {
      message: "date of birth must be in the past",
    }),
    gender: z.enum(["male", "female"], "invalid gender value"),
  })
  .refine((values) => values.password === values.rePassword, {
    message: "passwords don't match",
    path: ["rePassword"],
  });
export const LoginSchema = z.object({
  email: z
    .string()
    .email("invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "invalid email format",
    ),
  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    .max(20, "password must be at most 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
      "Password must contain uppercase, lowercase, number and special character",
    ),
});
