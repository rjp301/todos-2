import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../helpers/auth-middleware.ts";
import { zValidator } from "@hono/zod-validator";
import { Category, CategoryItem, List, and, db, eq } from "astro:db";
import { validIdSchema } from "../lib/validators";
import { generateId } from "../helpers/generate-id";

const idAndUserIdFilter = (props: { userId: string; id: string }) =>
  and(eq(CategoryItem.id, props.id), eq(CategoryItem.userId, props.userId));

const categoryUpdateSchema =
  z.custom<Partial<typeof CategoryItem.$inferInsert>>();

const app = new Hono()
  .use(authMiddleware)
  .post(
    "/",
    zValidator("json", z.object({ listId: validIdSchema(List) })),
    async (c) => {
      const { listId } = c.req.valid("json");
      const userId = c.get("user").id;
      const created = await db
        .insert(Category)
        .values({ id: generateId(), listId, userId })
        .returning()
        .then((rows) => rows[0]);
      return c.json(created);
    },
  )
  .post(
    "/delete",
    zValidator("json", z.object({ id: validIdSchema(CategoryItem) })),
    async (c) => {
      const { id } = c.req.valid("json");
      const userId = c.get("user").id;
      const deleted = await db
        .delete(CategoryItem)
        .where(idAndUserIdFilter({ id, userId }))
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
      z.object({
        id: validIdSchema(CategoryItem),
        value: categoryUpdateSchema,
      }),
    ),
    async (c) => {
      const { id, value } = c.req.valid("json");
      const userId = c.get("user").id;
      const updated = await db
        .update(CategoryItem)
        .set(value)
        .where(idAndUserIdFilter({ id, userId }))
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
          .update(CategoryItem)
          .set({ sortOrder: idx + 1 })
          .where(idAndUserIdFilter({ id, userId })),
      ),
    );
    return c.json(true);
  })
  .post(
    "/toggle-packed",
    zValidator("json", z.object({ id: validIdSchema(CategoryItem) })),
    async (c) => {
      const { id } = c.req.valid("json");
      const categoryItems = await db
        .select()
        .from(CategoryItem)
        .where(eq(CategoryItem.categoryId, id));
      const fullyPacked = categoryItems.every((item) => item.packed);
      const newValue = !fullyPacked;
      const newCategoryItems = await db
        .update(CategoryItem)
        .set({ packed: newValue })
        .where(eq(CategoryItem.categoryId, id))
        .returning();
      return c.json(newCategoryItems);
    },
  );

export default app;
