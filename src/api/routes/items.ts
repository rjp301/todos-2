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
  .delete(
    "/:id",
    zValidator("param", z.object({ id: validIdSchema(Item) })),
    async (c) => {
      const userId = c.get("user").id;
      const { id } = c.req.valid("param");
      await db.delete(CategoryItem).where(eq(CategoryItem.itemId, id));
      await db.delete(Item).where(idAndUserIdFilter(Item, { userId, id }));
      return c.json({ success: true });
    },
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: validIdSchema(Item) })),
    zValidator("json", itemUpdateSchema),
    async (c) => {
      const userId = c.get("user").id;
      const { id } = c.req.valid("param");
      const value = c.req.valid("json");
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
