import * as items from "./items";
import * as lists from "./lists";
import * as categories from "./categories";
import * as categoryItems from "./category-items";
import * as users from "./users";

export const server = {
  ...items,
  ...lists,
  ...categories,
  ...categoryItems,
  ...users,
};
