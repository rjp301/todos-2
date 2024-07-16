import SideBar from "@/app/components/sidebar/sidebar";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "../lib/client";
import { userQueryOptions } from "../lib/queries";
import DndWrapper from "../components/dnd-wrapper";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const me = await queryClient.ensureQueryData(userQueryOptions);
    if (!me) {
      throw redirect({
        to: "/welcome",
        search: { redirect: location.href },
      });
    }
  },
  component: () => (
    <div className="flex w-full">
      <DndWrapper>
        <SideBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </DndWrapper>
    </div>
  ),
});
