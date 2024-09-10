import type { ExpandedCategory, ExpandedList } from "@/lib/types";
import { getCategoryWeight, type WeightUnit } from "@/lib/weight-units";
import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { ActionError } from "astro:actions";
import {
  Category,
  CategoryItem,
  db,
  eq,
  inArray,
  Item,
  List,
  sql,
} from "astro:db";

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });
  }
  return user;
};

export const getExpandedList = async (
  listId: string,
): Promise<ExpandedList> => {
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

  const categoryIds = categories.map((c) => c.id);

  const categoryItems = await db
    .select()
    .from(CategoryItem)
    .where(
      categoryIds.length > 0
        ? inArray(CategoryItem.categoryId, categoryIds)
        : sql`FALSE`,
    )
    .leftJoin(Item, eq(CategoryItem.itemId, Item.id))
    .orderBy(CategoryItem.sortOrder);

  const expandedCategories: ExpandedCategory[] = categories.map((category) => {
    const items = categoryItems
      .filter((ci) => ci.CategoryItem.categoryId === category.id)
      .filter((ci) => ci.Item !== null)
      .map((ci) => ({ ...ci.CategoryItem, itemData: ci.Item! }));
    const weight = getCategoryWeight(items, list.weightUnit as WeightUnit);
    const packed = items.every((ci) => ci.packed);
    return { ...category, items, weight, packed };
  });

  const result: ExpandedList = { ...list, categories: expandedCategories };
  return result;
};

export const getListItemIds = async (listId: string) => {
  const categoryIds = await db
    .select({ id: Category.id })
    .from(Category)
    .where(eq(Category.listId, listId))
    .then((ids) => ids.map((id) => id.id));

  const categoryItems = await db
    .select({ id: Item.id })
    .from(CategoryItem)
    .where(inArray(CategoryItem.categoryId, categoryIds))
    .rightJoin(Item, eq(CategoryItem.itemId, Item.id));

  return new Set(categoryItems.map((categoryItem) => categoryItem.id));
};
