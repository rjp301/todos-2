import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../helpers/auth-middleware.ts";
import { idAndUserIdFilter, validIdSchema } from "@/api/lib/validators.ts";
import { zValidator } from "@hono/zod-validator";
import { Category, CategoryItem, Item, List, db, eq, max } from "astro:db";
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
  .post(
    "/",
    paramValidator,
    zValidator(
      "json",
      z.object({
        itemId: validIdSchema(Item).optional(),
        categoryItemId: z.string().optional(),
        categoryItemIds: z.array(z.string()).optional(),
      }),
    ),
    async (c) => {
      const { categoryId } = c.req.valid("param");
      const userId = c.get("user").id;
      const {
        itemId = generateId(),
        categoryItemId = generateId(),
        categoryItemIds,
      } = c.req.valid("json");

      const isNewItem = c.req.valid("json").itemId === undefined;

      if (isNewItem) {
        await db
          .insert(Item)
          .values({ id: itemId, userId })
          .returning()
          .then((rows) => rows[0].id);
      }

      const { max: maxSortOrder } = await db
        .select({ max: max(CategoryItem.sortOrder) })
        .from(CategoryItem)
        .where(eq(CategoryItem.categoryId, categoryId))
        .then((rows) => rows[0]);

      const created = await db
        .insert(CategoryItem)
        .values({
          id: categoryItemId,
          sortOrder: maxSortOrder ?? 1,
          userId,
          categoryId,
          itemId,
        })
        .returning()
        .then((rows) => rows[0]);

      if (categoryItemIds) {
        await Promise.all(
          categoryItemIds.map((id, index) =>
            db
              .update(CategoryItem)
              .set({ sortOrder: index + 1, categoryId })
              .where(idAndUserIdFilter(CategoryItem, { userId, id })),
          ),
        );
      }

      return c.json(created);
    },
  )
  .put(
    "/reorder",
    paramValidator,
    zValidator("json", z.array(z.string())),
    async (c) => {
      const userId = c.get("user").id;
      const { categoryId } = c.req.valid("param");
      const ids = c.req.valid("json");
      await Promise.all(
        ids.map((id, index) =>
          db
            .update(CategoryItem)
            .set({ sortOrder: index + 1, categoryId })
            .where(idAndUserIdFilter(CategoryItem, { userId, id })),
        ),
      );
      return c.json({ success: true });
    },
  );

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
