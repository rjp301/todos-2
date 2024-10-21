import type { APIRoute } from "astro";
import { count, db, User } from "astro:db";

export const GET: APIRoute = async () => {
  const numUsers = await db
    .select({ count: count() })
    .from(User)
    .then((rows) => rows[0].count);
  return new Response(`There are ${numUsers} users in the database.`);
};
