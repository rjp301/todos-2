import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { ActionError } from "astro:actions";
import { Category, CategoryItem, db, eq, inArray, Item } from "astro:db";

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
