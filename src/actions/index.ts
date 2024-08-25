import * as items from "./items";
import * as lists from "./lists";
import * as categories from "./categories";
import * as categoryItems from "./category-items";

export const server = {
  ...items,
  ...lists,
  ...categories,
  ...categoryItems,
};
