import { db, eq } from "astro:db";
import { z } from "zod";
import type { AllTables } from "./types";

export const validIdSchema = (table: AllTables) =>
  z.string().refine(async (value) => {
    const list = await db.select().from(table).where(eq(table.id, value));
    return list.length > 0;
  });
