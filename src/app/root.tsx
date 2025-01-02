import React from "react";
import { Outlet } from "react-router-dom";
import ItemEditor from "@/components/item-editor/item-editor";
import SideBar from "@/components/sidebar/app-sidebar";
import FeedbackButton from "@/components/feedback-button";
import { SidebarProvider } from "@/components/ui/sidebar";

const Root: React.FC = () => {
  return (
    <>
      <ItemEditor />
      {/* <SidebarProvider
        style={{
          // @ts-ignore
          "--sidebar-width": "18rem",
          "--sidebar-width-mobile": "18rem",
        }}
      > */}
        <SideBar />
        <main className="h-[100svh] flex-1 overflow-hidden">
          <Outlet />
        </main>
      {/* </SidebarProvider> */}
      <FeedbackButton />
    </>
  );
};

export default Root;
