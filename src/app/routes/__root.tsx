import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <main className="flex h-[100svh] overflow-hidden">
      <Outlet />
    </main>
  ),
});
