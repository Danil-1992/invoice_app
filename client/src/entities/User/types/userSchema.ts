import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  userName: z.string(),
  email: z.email(),
});

export type User = z.infer<typeof UserSchema>;

export const UserResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

export const UserRegisterSchema = z
  .object({
    name: z.string().min(2, "Имя должно содержать не менее 2 символов"),
    email: z.email("Некорректный email"),
    password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
    confirmPassword: z
      .string()
      .min(6, "Пароль должен содержать не менее 6 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type UserRegister = z.infer<typeof UserRegisterSchema>;

export const UserLoginSchema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
});

export type UserLogin = z.infer<typeof UserLoginSchema>;

export const ServerErrorSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
  retryAfter: z.string().optional(),
});

export type ServerError = z.infer<typeof ServerErrorSchema>;
