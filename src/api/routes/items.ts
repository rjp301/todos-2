import { z } from "zod";
import { Hono } from "hono";
import authMiddleware from "../helpers/auth-middleware.ts";
import { zValidator } from "@hono/zod-validator";
import { CategoryItem, Item, db, eq } from "astro:db";
import { idAndUserIdFilter, validIdSchema } from "../../lib/validators.ts";
import { generateId } from "../helpers/generate-id";

const itemUpdateSchema = z.custom<Partial<typeof Item.$inferInsert>>();
const itemIdValidator = zValidator(
  "param",
  z.object({ itemId: validIdSchema(Item) }),
);

export const itemRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const items = await db.select().from(Item).where(eq(Item.userId, userId));
    return c.json(items);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        data: z.custom<Partial<typeof Item.$inferInsert>>().optional(),
      }),
    ),
    async (c) => {
      const userId = c.get("user").id;
      const { data } = c.req.valid("json");
      const newItem = await db
        .insert(Item)
        .values({ ...data, userId, id: generateId() })
        .returning()
        .then((rows) => rows[0]);
      return c.json(newItem);
    },
  )
  .post("/:itemId/duplicate", itemIdValidator, async (c) => {
    const userId = c.get("user").id;
    const { itemId } = c.req.valid("param");
    const item = await db
      .select()
      .from(Item)
      .where(idAndUserIdFilter(Item, { userId, id: itemId }))
      .then((rows) => rows[0]);

    if (!item) {
      return c.notFound();
    }
    const newItem = await db
      .insert(Item)
      .values({ ...item, id: generateId() })
      .returning()
      .then((rows) => rows[0]);
    return c.json(newItem);
  })
  .delete("/:itemId", itemIdValidator, async (c) => {
    const userId = c.get("user").id;
    const { itemId } = c.req.valid("param");
    await db.delete(CategoryItem).where(eq(CategoryItem.itemId, itemId));
    await db
      .delete(Item)
      .where(idAndUserIdFilter(Item, { userId, id: itemId }));
    return c.json({ success: true });
  })
  .patch(
    "/:itemId",
    itemIdValidator,
    zValidator("json", itemUpdateSchema),
    async (c) => {
      const userId = c.get("user").id;
      const { itemId } = c.req.valid("param");
      const value = c.req.valid("json");
      const updated = await db
        .update(Item)
        .set(value)
        .where(idAndUserIdFilter(Item, { userId, id: itemId }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  );
