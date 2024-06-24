import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../helpers/auth-middleware.ts";
import { validIdSchema } from "@/api/lib/validators.ts";
import { zValidator } from "@hono/zod-validator";
import { Category, CategoryItem, Item, and, db, eq } from "astro:db";
import { generateId } from "../helpers/generate-id";

const idAndUserIdFilter = (props: { userId: string; id: string }) =>
  and(eq(CategoryItem.id, props.id), eq(CategoryItem.userId, props.userId));

const categoryUpdateSchema =
  z.custom<Partial<typeof CategoryItem.$inferInsert>>();

const app = new Hono()
  .use(authMiddleware)
  .post(
    "/",
    zValidator("json", z.object({ categoryId: validIdSchema(Category) })),
    async (c) => {
      const { categoryId } = c.req.valid("json");
      const userId = c.get("user").id;
      const createdItem = await db
        .insert(Item)
        .values({ id: generateId(), userId })
        .returning()
        .then((rows) => rows[0]);

      const created = await db
        .insert(CategoryItem)
        .values({
          id: generateId(),
          userId,
          categoryId,
          itemId: createdItem.id,
        })
        .returning()
        .then((rows) => rows[0]);

      return c.json(created);
    },
  )
  .post(
    "/toggle-packed",
    zValidator(
      "json",
      z.object({
        id: validIdSchema(CategoryItem),
        value: z.boolean().optional(),
      }),
    ),
    async (c) => {
      const { id, value } = c.req.valid("json");
      const item = await db
        .select()
        .from(CategoryItem)
        .where(eq(CategoryItem.id, id));
      const isPacked = item[0].packed;

      const updated = await db
        .update(CategoryItem)
        .set({ packed: value ?? !isPacked })
        .where(eq(CategoryItem.id, id))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  )
  .post(
    "/delete",
    zValidator("json", z.object({ id: validIdSchema(CategoryItem) })),
    async (c) => {
      const userId = c.get("user").id;
      const { id } = c.req.valid("json");
      const deleted = await db
        .delete(CategoryItem)
        .where(idAndUserIdFilter({ userId, id }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(deleted);
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
      const userId = c.get("user").id;
      const { id, value } = c.req.valid("json");
      const updated = await db
        .update(CategoryItem)
        .set(value)
        .where(idAndUserIdFilter({ userId, id }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  );

export default app;
