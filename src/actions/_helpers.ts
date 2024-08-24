import type { APIContext } from "astro";
import { ActionError } from "astro:actions";

export const isAuthorized = (context: APIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });
  }
  return user;
};
