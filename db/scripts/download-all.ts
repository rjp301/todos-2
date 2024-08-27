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

const downloadTable = async (table: AnyTable, name: string) => {
  const rows = await db.select().from(table);
  const columnNames = Object.keys(rows[0]);
  const csv = [columnNames.join(",")];
  for (const row of rows) {
    const values = columnNames.map(
      (name) => `"${row[name as keyof typeof row]}"`,
    );
    csv.push(values.join(","));
  }
  console.log(csv.join("\n"));
  await fs.writeFile(`db/data/${name}.csv`, csv.join("\n"));
};

const downloadAll = async () => {
  for (const table of allTables) {
    await downloadTable(table.table, table.name);
  }
};

export default downloadAll;
