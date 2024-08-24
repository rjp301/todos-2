import { github, lucia } from "@/lib/lucia";
import { validateSearchParams } from "@/lib/validators";
import { generateState, OAuth2RequestError } from "arctic";
import { ActionError, defineAction } from "astro:actions";
import { db, eq, User } from "astro:db";
import { z } from "zod";

import { v4 as uuid } from "uuid";

export const loginGithub = defineAction({
  async handler(_, context) {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    context.cookies.set("github_oauth_state", state, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    return context.redirect(url.toString());
  },
});

export const loginGithubCallback = defineAction({
  async handler(_, context) {
    const validParams = validateSearchParams(
      context.url.searchParams,
      z.object({
        code: z.string(),
        state: z.string(),
      }),
    );

    if (!validParams) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid query params",
      });
    }

    const { code, state } = validParams;

    const github_oauth_state = context.cookies.get("github_oauth_state");

    if (state !== github_oauth_state?.value) {
      throw new ActionError({ code: "BAD_REQUEST", message: "Invalid state" });
    }

    try {
      const tokens = await github.validateAuthorizationCode(code);
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const githubUser: GitHubUser = await githubUserResponse.json();

      // Replace this with your own DB client.
      const existingUser = await db
        .select()
        .from(User)
        .where(eq(User.githubId, githubUser.id))
        .then((rows) => rows[0]);

      if (existingUser) {
        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
        return context.redirect("/");
      }

      // add user to database
      const user = await db
        .insert(User)
        .values({
          id: uuid(),
          githubId: githubUser.id,
          username: githubUser.login,
          name: githubUser.name,
          avatarUrl: githubUser.avatar_url,
        })
        .returning()
        .then((rows) => rows[0]);

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return context.redirect("/");
    } catch (e) {
      console.error(e);
      if (e instanceof OAuth2RequestError) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An OAuth error occured",
        });
      }
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred",
      });
    }
  },
});

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}
