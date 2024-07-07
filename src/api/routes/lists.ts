import { z } from "zod";
import { Hono } from "hono";
import authMiddleware from "../helpers/auth-middleware.ts";
import { zValidator } from "@hono/zod-validator";
import {
  Category,
  CategoryItem,
  Item,
  List,
  db,
  eq,
  inArray,
  max,
} from "astro:db";
import type { ExpandedCategory, ExpandedList } from "../lib/types";
import { idAndUserIdFilter, validIdSchema } from "../lib/validators";
import { generateId } from "../helpers/generate-id";

const listUpdateSchema = z.custom<Partial<typeof List.$inferInsert>>();

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const lists = await db
      .select()
      .from(List)
      .where(eq(List.userId, userId))
      .orderBy(List.sortOrder);
    return c.json(lists);
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: validIdSchema(List) })),
    async (c) => {
      const { id } = c.req.valid("param");
      const userId = c.get("user").id;

      const list = await db
        .select()
        .from(List)
        .where(eq(List.id, id))
        .then((rows) => rows[0]);

      const categories = await db
        .select()
        .from(Category)
        .where(eq(Category.listId, id))
        .orderBy(Category.sortOrder);

      const categoryItems = await db
        .select()
        .from(CategoryItem)
        .leftJoin(Item, eq(CategoryItem.itemId, Item.id))
        .where(eq(Item.userId, userId))
        .orderBy(CategoryItem.sortOrder);

      const expandedCategories: ExpandedCategory[] = categories.map(
        (category) => {
          const items = categoryItems
            .filter((ci) => ci.CategoryItem.categoryId === category.id)
            .filter((ci) => ci.Item !== null)
            .map((ci) => ({ ...ci.CategoryItem, itemData: ci.Item! }));
          const weight = items.reduce((acc, ci) => acc + ci.itemData.weight, 0);
          return { ...category, items, weight };
        },
      );

      const result: ExpandedList = { ...list, categories: expandedCategories };
      return c.json(result);
    },
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: validIdSchema(List) })),
    async (c) => {
      const userId = c.get("user").id;
      const { id } = c.req.valid("param");
      const deleted = await db
        .delete(List)
        .where(idAndUserIdFilter(List, { userId, id }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(deleted);
    },
  )
  // Create a new list
  .post("/", async (c) => {
    const userId = c.get("user").id;

    const { max: maxSortOrder } = await db
      .select({ max: max(List.sortOrder) })
      .from(List)
      .where(eq(List.userId, userId))
      .then((rows) => rows[0]);

    const newList = await db
      .insert(List)
      .values({
        id: generateId(),
        userId,
        sortOrder: maxSortOrder ? maxSortOrder + 1 : undefined,
      })
      .returning()
      .then((rows) => rows[0]);
    return c.json(newList);
  })

  .patch(
    "/:id",
    zValidator("param", z.object({ id: validIdSchema(List) })),
    zValidator("json", listUpdateSchema),
    async (c) => {
      const userId = c.get("user").id;
      const { id } = c.req.valid("param");
      const value = c.req.valid("json");
      const updated = await db
        .update(List)
        .set(value)
        .where(idAndUserIdFilter(List, { userId, id }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  )

  .put("/reorder", zValidator("json", z.array(z.string())), async (c) => {
    const userId = c.get("user").id;
    const ids = c.req.valid("json");
    await Promise.all(
      ids.map((id, idx) =>
        db
          .update(List)
          .set({ sortOrder: idx + 1 })
          .where(idAndUserIdFilter(List, { userId, id })),
      ),
    );
    return c.json(ids);
  })

  .post(
    "/:id/unpack",
    zValidator("param", z.object({ id: validIdSchema(List) })),
    async (c) => {
      const { id } = c.req.valid("param");
      const categoryItems = await db
        .select({ id: CategoryItem.id })
        .from(CategoryItem)
        .leftJoin(Category, eq(Category.id, CategoryItem.categoryId))
        .where(eq(Category.listId, id));

      const ids = categoryItems.filter((i) => i !== null).map((ci) => ci.id!);

      await db
        .update(CategoryItem)
        .set({ packed: false })
        .where(inArray(CategoryItem.id, ids));
    },
  );

export default app;
