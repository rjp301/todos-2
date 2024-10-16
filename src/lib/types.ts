import type { Category, CategoryItem, Item, List, User } from "astro:db";

const weightUnitOptions = ["g", "kg", "oz", "lb"] as const;
export type WeightUnit = (typeof weightUnitOptions)[number];

export const weightUnitsFull: Record<WeightUnit, string> = {
  g: "grams",
  kg: "kilograms",
  oz: "ounces",
  lb: "pounds",
};

export const weightUnits: Record<WeightUnit, string> = {
  g: "g",
  kg: "kg",
  oz: "oz",
  lb: "lb",
};

export type ItemSelect = typeof Item.$inferSelect;
export type ListSelect = typeof List.$inferSelect;
export type UserSelect = typeof User.$inferSelect;

export type ExpandedCategoryItem = typeof CategoryItem.$inferSelect & {
  itemData: typeof Item.$inferSelect;
};

export type ExpandedCategory = typeof Category.$inferSelect & {
  items: ExpandedCategoryItem[];
  weight: number;
  packed: boolean;
};

export type ExpandedList = typeof List.$inferSelect & {
  categories: ExpandedCategory[];
};

export type AllTables =
  | typeof List
  | typeof Item
  | typeof Category
  | typeof CategoryItem;
