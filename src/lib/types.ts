import type { Category, CategoryItem, Item, List, User } from "astro:db";

export type Unit = {
  symbol: string;
  multiplier: number;
  name: string;
};

export enum WeightUnit {
  Grams = "g",
  Kilograms = "kg",
  Ounces = "oz",
  Pounds = "lb",
}

export const weightUnits: Unit[] = [
  { symbol: WeightUnit.Grams, multiplier: 1, name: "grams" },
  { symbol: WeightUnit.Kilograms, multiplier: 1000, name: "kilograms" },
  { symbol: WeightUnit.Ounces, multiplier: 28.3495, name: "ounces" },
  { symbol: WeightUnit.Pounds, multiplier: 453.592, name: "pounds" },
];

export type ItemSelect = typeof Item.$inferSelect;
export type ListSelect = typeof List.$inferSelect;
export type UserSelect = typeof User.$inferSelect;

export type ExpandedCategoryItem = typeof CategoryItem.$inferSelect & {
  itemData: typeof Item.$inferSelect;
};

export type ExpandedCategory = typeof Category.$inferSelect & {
  items: ExpandedCategoryItem[];
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
