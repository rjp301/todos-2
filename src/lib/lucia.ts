import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub } from "arctic";

import { User, db, UserSession } from "astro:db";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "astro:env/server";

// @ts-ignore
const adapter = new DrizzleSQLiteAdapter(db, UserSession, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: async (user) => {
    return user;
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = Omit<typeof User.$inferSelect, "id">;

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
