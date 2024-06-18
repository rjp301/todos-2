import { cn } from "@/lib/utils";
import React from "react";
import Logo from "@/components/logo.tsx";
import PackingItems from "./packing-items/packing-items.tsx";
import PackingLists from "./packing-lists/packing-lists.tsx";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable.tsx";
import { useStore } from "@/lib/store";
import SidebarButton from "./side-bar-button.tsx";

const SideBar: React.FC = () => {
  const { isSidebarOpen = true } = useStore();

  return (
    <aside
      className={cn(
        "flex w-[300px] flex-col overflow-hidden border-r transition-all",
        !isSidebarOpen && "w-0 border-none",
      )}
    >
      <header className="flex h-14 items-center border-b">
        <SidebarButton closeAction />
        <Logo />
      </header>
      <ResizablePanelGroup autoSaveId="sidebar-panels" direction="vertical">
        <ResizablePanel defaultSize={40}>
          <PackingLists />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>
          <PackingItems />
          items
        </ResizablePanel>
      </ResizablePanelGroup>
    </aside>
  );
};

export default SideBar;
