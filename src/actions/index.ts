import { defineAction, z } from "astro:actions";

export const server = {
  log: defineAction({
    input: z.object({ message: z.string() }),
    handler: async ({ message }) => {
      console.log(message);
    },
  }),
};
