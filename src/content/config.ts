import { defineCollection } from "astro:content";
import { z } from "zod";

const policies = defineCollection({
  type: "content",
  schema: {
    sortOrder: z.number(),
  },
});

export const collections = {
  policies,
};
