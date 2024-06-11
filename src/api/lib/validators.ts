import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/api/db/index.ts";
import { listsTable } from "@/api/db/schema.ts";

export const validListId = z.string().refine(async (value) => {
  const list = await db
    .select()
    .from(listsTable)
    .where(eq(listsTable.id, value));
  return list.length > 0;
});
