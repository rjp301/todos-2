import { z } from "zod";
import { idAndUserIdFilter } from "@/lib/validators.ts";
import { CategoryItem, Item, db, eq, max } from "astro:db";
import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";

import { v4 as uuid } from "uuid";

const categoryItemUpdateSchema =
  z.custom<Partial<typeof CategoryItem.$inferInsert>>();
const itemUpdateSchema = z.custom<Partial<typeof Item.$inferInsert>>();

export const addItemToCategory = defineAction({
  input: z.object({
    itemId: z.string(),
    categoryId: z.string(),
    reorderIds: z.array(z.string()).optional(),
    data: categoryItemUpdateSchema.optional(),
  }),
  handler: async ({ itemId, categoryId, reorderIds, data }, c) => {
    const userId = isAuthorized(c).id;

    const { max: maxSortOrder } = await db
      .select({ max: max(CategoryItem.sortOrder) })
      .from(CategoryItem)
      .where(eq(CategoryItem.categoryId, categoryId))
      .then((rows) => rows[0]);

    const created = await db
      .insert(CategoryItem)
      .values({
        id: uuid(),
        ...data,
        sortOrder: maxSortOrder ?? 1,
        categoryId,
        itemId,
        userId,
      })
      .returning()
      .then((rows) => rows[0]);

    if (reorderIds) {
      await Promise.all(
        reorderIds.map((id, index) =>
          db
            .update(CategoryItem)
            .set({ sortOrder: index + 1, categoryId })
            .where(idAndUserIdFilter(CategoryItem, { userId, id })),
        ),
      );
    }

    return created;
  },
});

export const createNewItemAndAddToCategory = defineAction({
  input: z.object({
    categoryId: z.string(),
    itemData: itemUpdateSchema.optional(),
    data: categoryItemUpdateSchema.optional(),
  }),
  handler: async ({ categoryId, itemData, data }, c) => {
    const userId = isAuthorized(c).id;

    const newItem = await db
      .insert(Item)
      .values({ id: uuid(), ...itemData, userId })
      .returning()
      .then((rows) => rows[0]);

    const { max: maxSortOrder } = await db
      .select({ max: max(CategoryItem.sortOrder) })
      .from(CategoryItem)
      .where(eq(CategoryItem.categoryId, categoryId))
      .then((rows) => rows[0]);

    const created = await db
      .insert(CategoryItem)
      .values({
        id: uuid(),
        sortOrder: maxSortOrder ?? 1,
        categoryId,
        itemId: newItem.id,
        ...data,
        userId,
      })
      .returning()
      .then((rows) => rows[0]);

    return created;
  },
});

export const reorderCategoryItems = defineAction({
  input: z.object({ ids: z.string().array(), categoryId: z.string() }),
  handler: async ({ ids, categoryId }, c) => {
    const userId = isAuthorized(c).id;
    await Promise.all(
      ids.map((id, index) =>
        db
          .update(CategoryItem)
          .set({ sortOrder: index + 1, categoryId })
          .where(idAndUserIdFilter(CategoryItem, { userId, id })),
      ),
    );
    return true;
  },
});

export const updateCategoryItem = defineAction({
  input: z.object({
    categoryItemId: z.string(),
    data: categoryItemUpdateSchema,
  }),
  handler: async ({ categoryItemId, data }, c) => {
    const userId = isAuthorized(c).id;
    const updated = await db
      .update(CategoryItem)
      .set(data)
      .where(idAndUserIdFilter(CategoryItem, { userId, id: categoryItemId }))
      .returning()
      .then((rows) => rows[0]);
    return updated;
  },
});

export const deleteCategoryItem = defineAction({
  input: z.object({ categoryItemId: z.string() }),
  handler: async ({ categoryItemId }, c) => {
    const userId = isAuthorized(c).id;
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

    return true;
  },
});
