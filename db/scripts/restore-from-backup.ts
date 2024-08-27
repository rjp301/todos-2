import fs from "fs/promises";
import {
  User,
  UserSession,
  Item,
  List,
  Category,
  CategoryItem,
  db,
} from "astro:db";

const allTables = [
  { table: User, name: "user" },
  { table: UserSession, name: "user_session" },
  { table: Item, name: "item" },
  { table: List, name: "list" },
  { table: Category, name: "category" },
  { table: CategoryItem, name: "category_item" },
];

type AnyTable = (typeof allTables)[number]["table"];

async function restoreFromBackup(table: AnyTable, name: string) {
  const file = await fs.readFile(`db/data/${name}.json`, "utf-8");
  const data = JSON.parse(file);

  try {
    await db.insert(table).values(data);
  } catch (error) {
    console.error(`Error restoring ${name}`);
    console.error(error);
    console.log(data.slice(0, 5));
  }
  // console.log(data);
}

export default async function restoreAll() {
  for (const table of allTables.toReversed()) {
    await db.delete(table.table);
    console.log(`Deleted ${table.name}`);
  }

  for (const table of allTables) {
    console.log(`Restoring ${table.name}`);
    await restoreFromBackup(table.table, table.name);
  }
}
