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
import type { ExpandedCategory, ExpandedList } from "../../lib/types.ts";
import { idAndUserIdFilter, validIdSchema } from "../../lib/validators.ts";
import { generateId } from "../helpers/generate-id";
import { categoryRoutes } from "./categories";

const listUpdateSchema = z.custom<Partial<typeof List.$inferInsert>>();
const listIdValidator = zValidator(
  "param",
  z.object({ listId: validIdSchema(List) }),
);

const lists = new Hono()
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
  });

const list = new Hono()
  .use(authMiddleware)
  .get("/", listIdValidator, async (c) => {
    const { listId } = c.req.valid("param");
    const userId = c.get("user").id;

    const list = await db
      .select()
      .from(List)
      .where(eq(List.id, listId))
      .then((rows) => rows[0]);

    const categories = await db
      .select()
      .from(Category)
      .where(eq(Category.listId, listId))
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
        const packed = items.every((ci) => ci.packed);
        return { ...category, items, weight, packed };
      },
    );

    const result: ExpandedList = { ...list, categories: expandedCategories };
    return c.json(result);
  })
  .patch(
    "/",
    listIdValidator,
    zValidator("json", listUpdateSchema),
    async (c) => {
      const userId = c.get("user").id;
      const { listId } = c.req.valid("param");
      const value = c.req.valid("json");
      const updated = await db
        .update(List)
        .set(value)
        .where(idAndUserIdFilter(List, { userId, id: listId }))
        .returning()
        .then((rows) => rows[0]);
      return c.json(updated);
    },
  )
  .delete("/", listIdValidator, async (c) => {
    const userId = c.get("user").id;
    const { listId } = c.req.valid("param");
    const listCategories = await db
      .select()
      .from(Category)
      .where(eq(Category.listId, listId));

    if (listCategories.length) {
      await db.delete(CategoryItem).where(
        inArray(
          CategoryItem.categoryId,
          listCategories.map((c) => c.id),
        ),
      );
    }
    await db.delete(Category).where(eq(Category.listId, listId));
    await db
      .delete(List)
      .where(idAndUserIdFilter(List, { userId, id: listId }))
      .returning()
      .then((rows) => rows[0]);
    return c.json({ success: true });
  })
  .post("/unpack", listIdValidator, async (c) => {
    const { listId } = c.req.valid("param");
    const categoryItems = await db
      .select({ id: CategoryItem.id })
      .from(CategoryItem)
      .leftJoin(Category, eq(Category.id, CategoryItem.categoryId))
      .where(eq(Category.listId, listId));
    const ids = categoryItems.filter((i) => i !== null).map((ci) => ci.id!);
    await db
      .update(CategoryItem)
      .set({ packed: false })
      .where(inArray(CategoryItem.id, ids));
  })
  .post("/duplicate", listIdValidator, async (c) => {
    const userId = c.get("user").id;
    const { listId } = c.req.valid("param");

    const list = await db
      .select()
      .from(List)
      .where(idAndUserIdFilter(List, { userId, id: listId }))
      .then((rows) => rows[0]);

    const categories = await db
      .select()
      .from(Category)
      .where(eq(Category.listId, listId))
      .orderBy(Category.sortOrder);

    const categoryItems = await db
      .select()
      .from(CategoryItem)
      .leftJoin(Category, eq(CategoryItem.categoryId, Category.id))
      .where(eq(Category.listId, listId));

    const { id: newListId } = await db
      .insert(List)
      .values({
        ...list,
        id: generateId(),
        name: `${list.name} (Copy)`,
      })
      .returning()
      .then((rows) => rows[0]);

    await Promise.all(
      categories.map(async (category) => {
        const newCategory = await db
          .insert(Category)
          .values({
            ...category,
            id: generateId(),
            listId: newListId,
          })
          .returning()
          .then((rows) => rows[0]);

        const newCategoryItems = categoryItems
          .filter((ci) => ci.CategoryItem.categoryId === category.id)
          .map((ci) => ({
            ...ci.CategoryItem,
            id: generateId(),
            categoryId: newCategory.id,
          }));

        await db.insert(CategoryItem).values(newCategoryItems);
        return newCategory;
      }),
    );

    return c.json({ success: true, id: newListId });
  })
  .route("/categories", categoryRoutes);

export const listRoutes = new Hono().route("/", lists).route("/:listId", list);
