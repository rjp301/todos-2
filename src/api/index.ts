import { Hono } from "hono";
import authRoutes from "./routes/auth";
import { itemRoutes } from "./routes/items";
import { listRoutes } from "./routes/lists";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", authRoutes)
  .route("/items", itemRoutes)
  .route("/lists", listRoutes)
  .get("/", (c) => c.json({ message: "Hello Hono!" }));

export default app;
export type AppType = typeof routes;
