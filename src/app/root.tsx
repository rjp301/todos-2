import React from "react";
import { Outlet } from "react-router-dom";
import ItemEditor from "@/components/item-editor/item-editor";
import SideBar from "@/components/sidebar/sidebar";
import FeedbackButton from "@/components/feedback-button";

const Root: React.FC = () => {
  return (
    <>
      <main className="flex h-[100svh] overflow-hidden">
        <ItemEditor />
        <SideBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
      <FeedbackButton />
    </>
  );
};

export default Root;
