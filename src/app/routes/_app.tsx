import SideBar from "@/app/components/side-bar";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "../lib/client";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const me = await api.auth.me.$get();
    if (!me.ok) {
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
