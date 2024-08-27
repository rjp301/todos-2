import {
  User,
  UserSession,
  Item,
  List,
  Category,
  CategoryItem,
} from "astro:db";

export const allTables = [
  { table: User, name: "user" },
  { table: UserSession, name: "user_session" },
  { table: Item, name: "item" },
  { table: List, name: "list" },
  { table: Category, name: "category" },
  { table: CategoryItem, name: "category_item" },
];

export type AnyTable = (typeof allTables)[number];
