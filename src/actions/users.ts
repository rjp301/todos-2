import { defineAction } from "astro:actions";
import {
  Category,
  CategoryItem,
  db,
  eq,
  Item,
  List,
  User,
  UserSession,
} from "astro:db";
import { getUser, isAuthorized } from "@/lib/helpers";

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
    await db.delete(CategoryItem).where(eq(CategoryItem.userId, userId));
    await db.delete(Item).where(eq(Item.userId, userId));
    await db.delete(Category).where(eq(Category.userId, userId));
    await db.delete(List).where(eq(List.userId, userId));
    await db.delete(UserSession).where(eq(UserSession.userId, userId));
    await db.delete(User).where(eq(User.id, userId));
    return true;
  },
});
