import { and, eq } from "astro:db";
import { type AllTables } from "./types";

export const idAndUserIdFilter = (
  table: AllTables,
  props: { userId: string; id: string },
) => and(eq(table.id, props.id), eq(table.userId, props.userId));
