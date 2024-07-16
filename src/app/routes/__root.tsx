import { createRootRoute, Outlet } from "@tanstack/react-router";
import DndWrapper from "../components/dnd-wrapper";

export const Route = createRootRoute({
  component: () => (
    <main className="flex h-[100svh] overflow-hidden">
      <DndWrapper>
        <Outlet />
      </DndWrapper>
    </main>
  ),
});
