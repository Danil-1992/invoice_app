import { AxiosError } from "axios";
import { ZodError } from "zod";

export function errorHandle(error: unknown): never {
  if (error instanceof AxiosError)
    throw new Error(error.response?.data?.message || error.message);
  if (error instanceof ZodError) {
    console.error(error);
    throw new Error("Ошибка валидации данных");
  }
  if (error instanceof Error) throw error;

  throw new Error("Неизвестная ошибка");
}
