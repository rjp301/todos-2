import { defineAction } from "astro:actions";
import { db, eq, User } from "astro:db";
import { getUser, isAuthorized } from "../lib/helpers";

export const getMe = defineAction({
  handler: async (_, c) => {
    const user = c.locals.user;
    if (!user) return null;
    return await getUser(user.id);
  },
});

export const deleteUser = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    await db.delete(User).where(eq(User.id, userId));
    return true;
  },
});
