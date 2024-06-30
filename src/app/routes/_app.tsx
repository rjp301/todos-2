import SideBar from "@/app/components/side-bar";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "../lib/client";
import { userQueryOptions } from "../lib/queries";

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
      <SideBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  ),
});
