import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import sharp from "sharp";
import { z } from "zod";

const app = new Hono().post(
  "/resize",
  zValidator("form", z.object({ file: z.instanceof(File) })),
  async (c) => {
    const { file } = c.req.valid("form");

    const buffer = await file.arrayBuffer();
    const resized = await sharp(buffer).resize(100).toFormat("jpeg").toBuffer();

    return stream(c, async (stream) => {
      await stream.write(new Uint8Array(resized));
    });
  },
);

export default app;
