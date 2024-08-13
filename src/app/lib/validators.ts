import { z } from "zod";

export function isEntity<T>(data: unknown): boolean {
  return z.custom<T>().safeParse(data).success;
}
