import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../helpers/auth-middleware.ts";
import { idAndUserIdFilter, validIdSchema } from "@/api/lib/validators.ts";
import { zValidator } from "@hono/zod-validator";
import { Category, CategoryItem, Item, List, db, eq } from "astro:db";
import { generateId } from "../helpers/generate-id";

const categoryUpdateSchema =
  z.custom<Partial<typeof CategoryItem.$inferInsert>>();

const paramValidator = zValidator(
  "param",
  z.object({
    listId: validIdSchema(List),
    categoryId: validIdSchema(Category),
  }),
);

const paramValidatorWithId = zValidator(
  "param",
  z.object({
    listId: validIdSchema(List),
    categoryId: validIdSchema(Category),
    categoryItemId: validIdSchema(CategoryItem),
  }),
);

const categoryItems = new Hono()
  .use(authMiddleware)
  .post("/", paramValidator, async (c) => {
    const { categoryId } = c.req.valid("param");
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
  });

const categoryItem = new Hono()
  .use(authMiddleware)
  .delete("/", paramValidatorWithId, async (c) => {
    const userId = c.get("user").id;
    const { categoryItemId } = c.req.valid("param");
    const deleted = await db
      .delete(CategoryItem)
      .where(idAndUserIdFilter(CategoryItem, { userId, id: categoryItemId }))
      .returning()
      .then((rows) => rows[0]);

    // delete item if it has no name, description, and weight
    const item = await db
      .select()
      .from(Item)
      .where(eq(Item.id, deleted.itemId))
      .then((rows) => rows[0]);
    if (item.name === "" && item.description === "" && item.weight === 0) {
      await db.delete(Item).where(eq(Item.id, deleted.itemId));
    }

    return c.json(true);
  })
  .patch(
    "/",
    paramValidatorWithId,
    zValidator("json", categoryUpdateSchema),
    async (c) => {
      const userId = c.get("user").id;
      const value = c.req.valid("json");
      const { categoryItemId } = c.req.valid("param");
      const updated = await db
        .update(CategoryItem)
        .set(value)
        .where(idAndUserIdFilter(CategoryItem, { userId, id: categoryItemId }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  );

export const categoryItemRoutes = new Hono()
  .route("/", categoryItems)
  .route(":categoryItemId", categoryItem);
