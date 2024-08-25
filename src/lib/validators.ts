import { and, eq } from "astro:db";
import { z } from "zod";
import { type AllTables } from "./types";

export const idAndUserIdFilter = (
  table: AllTables,
  props: { userId: string; id: string },
) => and(eq(table.id, props.id), eq(table.userId, props.userId));

export function validateSearchParams<T extends object>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>,
): T | null {
  const searchObject = Object.fromEntries(searchParams.entries());
  const parsed = schema.safeParse(searchObject);
  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}
