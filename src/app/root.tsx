import React from "react";
import { Outlet } from "react-router-dom";
import ItemEditor from "@/components/item-editor/item-editor";
import SideBar from "@/components/sidebar/app-sidebar";
import FeedbackButton from "@/components/feedback-button";

const Root: React.FC = () => {
  return (
    <main className="flex">
      <ItemEditor />

      <SideBar />
      <div className="h-[100svh] flex-1 overflow-hidden">
        <Outlet />
      </div>

      <FeedbackButton />
    </main>
  );
};

export default Root;
