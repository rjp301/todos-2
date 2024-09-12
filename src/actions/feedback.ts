import { isAuthorized } from "@/lib/helpers";
import { defineAction } from "astro:actions";
import { AppFeedback, db } from "astro:db";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export const addFeedback = defineAction({
  input: z.object({
    feedback: z.string(),
  }),
  handler: async ({ feedback }, c) => {
    const userId = isAuthorized(c).id;
    return await db
      .insert(AppFeedback)
      .values({ id: uuid(), feedback, userId })
      .returning()
      .then((rows) => rows[0]);
  },
});
