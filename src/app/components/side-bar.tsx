import { cn } from "@/lib/utils";
import React from "react";
import Logo from "./logo";
import PackingItems from "./packing-items/packing-items";
import PackingLists from "./packing-lists/packing-lists";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useStore } from "@/app/lib/store";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";
import SidebarButton from "./side-bar-button";

const SideBar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useStore();

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (isMobile) {
    return (
      <>
        <aside
          className={cn(
            "absolute left-0 top-0 z-50 flex h-full w-[300px] flex-col overflow-hidden border-r bg-background transition-all",
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
            <ResizablePanel>
              <PackingItems />
            </ResizablePanel>
          </ResizablePanelGroup>
        </aside>
        {isSidebarOpen && (
          <div
            onClick={() => toggleSidebar(false)}
            className="absolute inset-0 z-40 bg-muted/50"
          />
        )}
      </>
    );
  }

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
        <ResizablePanel>
          <PackingItems />
        </ResizablePanel>
      </ResizablePanelGroup>
    </aside>
  );
};

export default SideBar;
