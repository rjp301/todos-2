import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../helpers/auth-middleware.ts";
import { zValidator } from "@hono/zod-validator";
import { Category, CategoryItem, List, db, eq, max } from "astro:db";
import { idAndUserIdFilter, validIdSchema } from "../lib/validators";
import { generateId } from "../helpers/generate-id";
import { categoryItemRoutes } from "./categories-items";

const categoryUpdateSchema =
  z.custom<Partial<typeof CategoryItem.$inferInsert>>();

const paramValidator = zValidator(
  "param",
  z.object({ listId: validIdSchema(List) }),
);

const paramValidatorWithId = zValidator(
  "param",
  z.object({
    listId: validIdSchema(List),
    categoryId: validIdSchema(Category),
  }),
);

const categories = new Hono()
  .use(authMiddleware)
  .post("/", paramValidator, async (c) => {
    const { listId } = c.req.valid("param");
    const userId = c.get("user").id;
    const { max: maxSortOrder } = await db
      .select({ max: max(Category.sortOrder) })
      .from(Category)
      .where(eq(Category.listId, listId))
      .then((rows) => rows[0]);

    const created = await db
      .insert(Category)
      .values({
        id: generateId(),
        sortOrder: maxSortOrder ? maxSortOrder + 1 : undefined,
        listId,
        userId,
      })
      .returning()
      .then((rows) => rows[0]);
    return c.json(created);
  })
  .put(
    "/reorder",
    paramValidator,
    zValidator("json", z.array(z.string())),
    async (c) => {
      const userId = c.get("user").id;
      const ids = c.req.valid("json");
      await Promise.all(
        ids.map((id, idx) =>
          db
            .update(Category)
            .set({ sortOrder: idx + 1 })
            .where(idAndUserIdFilter(Category, { id, userId })),
        ),
      );
      return c.json(true);
    },
  );

const category = new Hono()
  .use(authMiddleware)
  .delete("/", paramValidatorWithId, async (c) => {
    const { categoryId } = c.req.valid("param");
    const userId = c.get("user").id;
    await db
      .delete(CategoryItem)
      .where(eq(CategoryItem.categoryId, categoryId));
    await db
      .delete(Category)
      .where(idAndUserIdFilter(Category, { id: categoryId, userId }));
    return c.json({ success: true });
  })
  .patch(
    "/",
    paramValidatorWithId,
    zValidator("json", categoryUpdateSchema),
    async (c) => {
      const { categoryId } = c.req.valid("param");
      const value = c.req.valid("json");
      const userId = c.get("user").id;
      const updated = await db
        .update(Category)
        .set(value)
        .where(idAndUserIdFilter(Category, { id: categoryId, userId }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  )
  .post("/toggle-packed", paramValidatorWithId, async (c) => {
    const { categoryId } = c.req.valid("param");
    const categoryItems = await db
      .select()
      .from(CategoryItem)
      .where(eq(CategoryItem.categoryId, categoryId));

    const fullyPacked = categoryItems.every((item) => item.packed);
    const newValue = !fullyPacked;

    const newCategoryItems = await db
      .update(CategoryItem)
      .set({ packed: newValue })
      .where(eq(CategoryItem.categoryId, categoryId))
      .returning();
    return c.json(newCategoryItems);
  })
  .route("/category-items", categoryItemRoutes);

export const categoryRoutes = categories
  .route("/", categories)
  .route("/:categoryId", category);
