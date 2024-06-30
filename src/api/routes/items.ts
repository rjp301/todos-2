import { z } from "zod";
import { Hono } from "hono";
import authMiddleware from "../helpers/auth-middleware.ts";
import { zValidator } from "@hono/zod-validator";
import { CategoryItem, Item, db, eq } from "astro:db";
import { idAndUserIdFilter, validIdSchema } from "../lib/validators";

const itemUpdateSchema = z.custom<Partial<typeof Item.$inferInsert>>();

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const items = await db.select().from(Item).where(eq(Item.userId, userId));
    return c.json(items);
  })
  .post(
    "/:id/delete",
    zValidator("param", z.object({ id: validIdSchema(Item) })),
    async (c) => {
      const userId = c.get("user").id;
      const { id } = c.req.valid("param");
      await db.delete(CategoryItem);
      const deleted = await db
        .delete(Item)
        .where(idAndUserIdFilter(Item, { userId, id }))
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
        id: validIdSchema(Item),
        value: itemUpdateSchema,
      }),
    ),
    async (c) => {
      const userId = c.get("user").id;
      const { id, value } = c.req.valid("json");
      const updated = await db
        .update(Item)
        .set(value)
        .where(idAndUserIdFilter(Item, { userId, id }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  );

export default app;
