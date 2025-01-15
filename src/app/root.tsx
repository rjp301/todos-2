import React from "react";
import { Outlet } from "react-router-dom";
import ItemEditor from "@/components/item-editor/item-editor";
import SideBar from "@/components/sidebar/sidebar";
import FeedbackButton from "@/components/feedback-button";

const Root: React.FC = () => {
  return (
    <main className="flex">
      <ItemEditor />
      <SideBar />
      <div className="h-[100svh] flex-1 overflow-hidden">
        <Outlet />
      </div>
      <div className="fixed bottom-6 right-6 flex items-center gap-4">
        <FeedbackButton />
      </div>
    </main>
  );
};

export default Root;
