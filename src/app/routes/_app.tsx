import SideBar from "@/app/components/sidebar/sidebar";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "../lib/queries";
import ItemEditor from "../components/item-editor/item-editor";

export const Route = createFileRoute("/_app")({
  component: () => (
    <div className="flex w-full">
      <ItemEditor />
      <SideBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  ),
});
