import { github, lucia } from "@/lib/lucia";
import { OAuth2RequestError } from "arctic";

import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import { z } from "zod";
import { validateSearchParams } from "@/lib/validators";
import { v4 as uuid } from "uuid";

export async function GET(context: APIContext): Promise<Response> {
  const validParams = validateSearchParams(
    context.url.searchParams,
    z.object({
      code: z.string(),
      state: z.string(),
    }),
  );

  if (!validParams) {
    return new Response("Invalid query params", { status: 400 });
  }

  const { code, state } = validParams;

  const github_oauth_state = context.cookies.get("github_oauth_state");

  if (state !== github_oauth_state?.value) {
    return new Response("Invalid state", { status: 400 });
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
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}
