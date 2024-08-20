import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import sharp from "sharp";
import { z } from "zod";

import fs from "node:fs/promises";

const app = new Hono().post(
  "/resize",
  zValidator("form", z.object({ file: z.instanceof(File) })),
  async (c) => {
    const { file } = c.req.valid("form");

    const buffer = await file.arrayBuffer();
    const resized = await sharp(buffer).resize(500).toFormat("jpeg").toBuffer();

    await fs.writeFile("./resized.jpg", resized);

    c.header("Content-Type", "image/jpeg");
    c.header("Content-Length", resized.byteLength.toString());
    c.header("Cache-Control", "no-cache");

    return stream(c, async (stream) => {
      await stream.write(resized);
      await stream.close();
    });
  },
);

export default app;
