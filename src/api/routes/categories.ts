import { db } from "@/api/db";
import {
  categoriesItemsTable,
  categoriesTable,
  categoryInsertSchema,
} from "@/api/db/schema";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../helpers/auth-middleware.ts";
import { zValidator } from "@hono/zod-validator";
import { validListId } from "../lib/validators.ts";

const idAndUserId = (props: { userId: string; id: string }) =>
  and(
    eq(categoriesTable.id, props.id),
    eq(categoriesTable.userId, props.userId),
  );

const app = new Hono()
  .use(authMiddleware)
  .post(
    "/",
    zValidator("json", z.object({ listId: validListId })),
    async (c) => {
      const { listId } = c.req.valid("json");
      const userId = c.get("user").id;
      const created = await db
        .insert(categoriesTable)
        .values({ list: listId, userId })
        .returning()
        .then((rows) => rows[0]);
      return c.json(created);
    },
  )
  .post(
    "/delete",
    zValidator("json", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("json");
      const userId = c.get("user").id;
      const deleted = await db
        .delete(categoriesTable)
        .where(idAndUserId({ id, userId }))
        .returning()
        .then((rows) => rows[0]);
      if (!deleted) return c.notFound();
      return c.json(true);
    },
  )
  .post(
    "/update",
    zValidator(
      "json",
      z.object({ id: z.string(), value: categoryInsertSchema.partial() }),
    ),
    async (c) => {
      const { id, value } = c.req.valid("json");
      const userId = c.get("user").id;
      const updated = await db
        .update(categoriesTable)
        .set(value)
        .where(idAndUserId({ id, userId }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  )
  .post("/reorder", zValidator("json", z.array(z.string())), async (c) => {
    const userId = c.get("user").id;
    const ids = c.req.valid("json");
    await Promise.all(
      ids.map((id, idx) =>
        db
          .update(categoriesTable)
          .set({ sortOrder: idx + 1 })
          .where(idAndUserId({ id, userId })),
      ),
    );
    return c.json(true);
  })
  .post(
    "/toggle-packed",
    zValidator("json", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("json");
      const categoryItems = await db
        .select()
        .from(categoriesItemsTable)
        .where(eq(categoriesItemsTable.category, id));
      const fullyPacked = categoryItems.every((item) => item.packed);
      const newValue = !fullyPacked;
      const newCategoryItems = await db
        .update(categoriesItemsTable)
        .set({ packed: newValue })
        .where(eq(categoriesItemsTable.category, id))
        .returning();
      return c.json(newCategoryItems);
    },
  );

export default app;
