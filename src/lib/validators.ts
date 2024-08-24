import { and, db, eq } from "astro:db";
import { z } from "zod";
import { type AllTables } from "./types";

export const validIdSchema = (table: AllTables) =>
  z.string().refine(async (value) => {
    const list = await db.select().from(table).where(eq(table.id, value));
    return list.length > 0;
  });

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
