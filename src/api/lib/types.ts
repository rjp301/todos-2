import type { Category, CategoryItem, Item, List } from "astro:db";

export type ExpandedCategoryItem = typeof CategoryItem.$inferSelect & {
  itemData: typeof Item.$inferSelect;
};

export type ExpandedCategory = typeof Category.$inferSelect & {
  items: ExpandedCategoryItem[];
};

export type ExpandedList = typeof List.$inferSelect & {
  categories: ExpandedCategory[];
};
