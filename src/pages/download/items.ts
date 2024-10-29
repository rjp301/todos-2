import { WeightUnit } from "@/lib/types";
import type { APIRoute } from "astro";
import { db, eq, Item } from "astro:db";
import { desc } from "drizzle-orm";

export const GET: APIRoute = async ({ locals }) => {
  const userId = locals.user?.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const items = await db
    .select({
      name: Item.name,
      description: Item.description,
      weight: Item.weight,
      weightUnit: Item.weightUnit,
      imageUrl: Item.image,
    })
    .from(Item)
    .where(eq(Item.userId, userId))
    .orderBy(desc(Item.name));

  const filename = `all-gear-${new Date().toISOString()}.csv`;

  return new Response("Hello, world!", {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/csv",
    },
  });
};
