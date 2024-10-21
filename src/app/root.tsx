import React from "react";
import { Outlet } from "react-router-dom";
import ItemEditor from "@/components/item-editor/item-editor";
import SideBar from "@/components/sidebar/sidebar";
import FeedbackButton from "@/components/feedback-button";
import { SidebarProvider } from "@/components/ui/sidebar";

const Root: React.FC = () => {
  return (
    <>
      <ItemEditor />
      <SidebarProvider>
        <SideBar />
        <main className="flex-1 h-[100svh] overflow-hidden">
          <Outlet />
        </main>
      </SidebarProvider>
      <FeedbackButton />
    </>
  );
};

export default Root;
