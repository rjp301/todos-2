import { z } from "zod";
import { Hono } from "hono";
import authMiddleware from "../helpers/auth-middleware.ts";
import { zValidator } from "@hono/zod-validator";
import { Item, and, db, eq } from "astro:db";

const idAndUserIdFilter = (props: { userId: string; id: string }) =>
  and(eq(Item.id, props.id), eq(Item.userId, props.userId));

const validItemIdSchema = z.string().refine(async (value) => {
  const list = await db.select().from(Item).where(eq(Item.id, value));
  return list.length > 0;
});

const itemUpdateSchema = z.custom<Partial<typeof Item.$inferInsert>>();

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const items = await db.select().from(Item).where(eq(Item.userId, userId));
    return c.json(items);
  })
  .post(
    "/delete",
    zValidator("json", z.object({ id: validItemIdSchema })),
    async (c) => {
      const userId = c.get("user").id;
      const { id } = c.req.valid("json");
      const deleted = await db
        .delete(Item)
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
        id: validItemIdSchema,
        value: itemUpdateSchema,
      }),
    ),
    async (c) => {
      const userId = c.get("user").id;
      const { id, value } = c.req.valid("json");
      const updated = await db
        .update(Item)
        .set(value)
        .where(idAndUserIdFilter({ userId, id }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  );

export default app;
