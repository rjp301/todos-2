import { cn, getIsTyping } from "@/lib/utils";
import React from "react";
import Logo from "../logo";
import PackingItems from "../packing-items/packing-items";
import PackingLists from "../packing-lists/packing-lists";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { NAVBAR_HEIGHT } from "@/lib/constants";

import { Sidebar, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { useEventListener } from "usehooks-ts";

const AppSideBar: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  useEventListener("keydown", (e) => {
    if (getIsTyping()) return;
    if (e.code === "KeyB") {
      toggleSidebar();
    }
  });

  return (
    <Sidebar>
      <header
        className={cn("flex shrink-0 items-center gap-4 border-b px-4")}
        style={{ height: NAVBAR_HEIGHT }}
      >
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
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSideBar;
