import React from "react";
import { Outlet } from "react-router-dom";
import ItemEditor from "./components/item-editor/item-editor";
import SideBar from "./components/sidebar/sidebar";

const Root: React.FC = () => {
  return (
    <main className="flex h-[100svh] overflow-hidden">
      <ItemEditor />
      <SideBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default Root;
