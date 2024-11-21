import { z } from "zod";
import {
  Category,
  CategoryItem,
  db,
  eq,
  max,
  and,
  ne,
  List,
  desc,
  notInArray,
} from "astro:db";
import { idAndUserIdFilter } from "@/lib/validators.ts";
import { ActionError, defineAction } from "astro:actions";
import { isAuthorized } from "@/lib/helpers";

import { v4 as uuid } from "uuid";

const categoryUpdateSchema = z.custom<Partial<typeof Category.$inferInsert>>();

export const getOtherListCategories = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c) => {
    const userId = isAuthorized(c).id;
    const categories = await db
      .select({
        id: Category.id,
        name: Category.name,
        listName: List.name,
        listId: List.id,
      })
      .from(Category)
      .innerJoin(List, eq(Category.listId, List.id))
      .where(and(eq(Category.userId, userId), ne(Category.listId, listId)))
      .orderBy(desc(List.sortOrder), desc(Category.sortOrder));
    return categories;
  },
});

export const copyCategoryToList = defineAction({
  input: z.object({
    categoryId: z.string(),
    listId: z.string(),
  }),
  handler: async ({ categoryId, listId }, c) => {
    const userId = isAuthorized(c).id;
    const { max: maxSortOrder } = await db
      .select({ max: max(Category.sortOrder) })
      .from(Category)
      .where(eq(Category.listId, listId))
      .then((rows) => rows[0]);

    const category = await db
      .select()
      .from(Category)
      .where(idAndUserIdFilter(Category, { id: categoryId, userId }))
      .then((rows) => rows[0]);

    if (!category) {
      throw new ActionError({
        message: "Category not found",
        code: "NOT_FOUND",
      });
    }

    const list = await db
      .select({ id: List.id })
      .from(List)
      .where(eq(List.id, listId));
    if (list.length < 1) {
      throw new ActionError({
        message: "List not found",
        code: "NOT_FOUND",
      });
    }

    const listItemIds = await db
      .select({ id: CategoryItem.itemId })
      .from(CategoryItem)
      .innerJoin(Category, eq(CategoryItem.categoryId, Category.id))
      .where(eq(Category.listId, listId))
      .then((rows) => rows.map((row) => row.id));

    const categoryItems = await db
      .select()
      .from(CategoryItem)
      .where(
        and(
          eq(CategoryItem.categoryId, categoryId),
          listItemIds.length > 0
            ? notInArray(CategoryItem.itemId, listItemIds)
            : undefined,
        ),
      );

    const newCategory = await db
      .insert(Category)
      .values({
        ...category,
        id: uuid(),
        sortOrder: maxSortOrder ? maxSortOrder + 1 : undefined,
        listId,
        userId,
      })
      .returning()
      .then((rows) => rows[0]);

    await Promise.all(
      categoryItems.map((item) =>
        db.insert(CategoryItem).values({
          ...item,
          id: uuid(),
          packed: false,
          categoryId: newCategory.id,
          userId,
        }),
      ),
    );
    return newCategory;
  },
});

export const createCategory = defineAction({
  input: z.object({
    listId: z.string(),
    data: categoryUpdateSchema.optional(),
  }),
  handler: async ({ listId, data }, c) => {
    const userId = isAuthorized(c).id;
    const { max: maxSortOrder } = await db
      .select({ max: max(Category.sortOrder) })
      .from(Category)
      .where(eq(Category.listId, listId))
      .then((rows) => rows[0]);

    const created = await db
      .insert(Category)
      .values({
        id: uuid(),
        sortOrder: maxSortOrder ? maxSortOrder + 1 : undefined,
        ...data,
        listId,
        userId,
      })
      .returning()
      .then((rows) => rows[0]);
    return created;
  },
});

export const reorderCategories = defineAction({
  input: z.object({
    listId: z.string(),
    ids: z.array(z.string()),
  }),
  handler: async ({ listId, ids }, c) => {
    const userId = isAuthorized(c).id;
    await Promise.all(
      ids.map((id, idx) =>
        db
          .update(Category)
          .set({ sortOrder: idx + 1, listId })
          .where(idAndUserIdFilter(Category, { id, userId })),
      ),
    );
    return true;
  },
});

export const deleteCategory = defineAction({
  input: z.object({ categoryId: z.string() }),
  handler: async ({ categoryId }, c) => {
    const userId = isAuthorized(c).id;
    await db
      .delete(CategoryItem)
      .where(eq(CategoryItem.categoryId, categoryId));
    await db
      .delete(Category)
      .where(idAndUserIdFilter(Category, { id: categoryId, userId }));
    return true;
  },
});

export const updateCategory = defineAction({
  input: z.object({
    categoryId: z.string(),
    data: categoryUpdateSchema,
  }),
  handler: async ({ categoryId, data }, c) => {
    const userId = isAuthorized(c).id;
    const updated = await db
      .update(Category)
      .set({ ...data, userId })
      .where(idAndUserIdFilter(Category, { id: categoryId, userId }))
      .returning()
      .then((rows) => rows[0]);
    return updated;
  },
});

export const toggleCategoryPacked = defineAction({
  input: z.object({ categoryId: z.string() }),
  handler: async ({ categoryId }, c) => {
    const userId = isAuthorized(c).id;
    const categoryItems = await db
      .select()
      .from(CategoryItem)
      .where(
        and(
          eq(CategoryItem.categoryId, categoryId),
          eq(CategoryItem.userId, userId),
        ),
      );

    const fullyPacked = categoryItems.every((item) => item.packed);

    const newCategoryItems = await db
      .update(CategoryItem)
      .set({ packed: !fullyPacked })
      .where(
        and(
          eq(CategoryItem.categoryId, categoryId),
          eq(CategoryItem.userId, userId),
        ),
      )
      .returning();
    return newCategoryItems;
  },
});
