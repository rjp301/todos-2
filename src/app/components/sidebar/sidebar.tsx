import { cn } from "@/app/lib/utils";
import React from "react";
import Logo from "../logo";
import PackingItems from "../packing-items/packing-items";
import PackingLists from "../packing-lists/packing-lists";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/app/components/ui/resizable";
import { useSidebarStore } from "./sidebar-store";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY, NAVBAR_HEIGHT } from "@/app/lib/constants";
import SidebarButton from "./sidebar-button";

import { Sheet, SheetContent } from "@/app/components/ui/sheet";

type ContentProps = {
  noButton?: boolean;
};

const SideBarContent: React.FC<ContentProps> = ({ noButton }) => (
  <div className="flex h-full flex-col overflow-hidden">
    <header
      className={cn("flex items-center border-b", noButton && "pl-4")}
      style={{ height: NAVBAR_HEIGHT }}
    >
      {!noButton && <SidebarButton />}
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
  </div>
);

const SideBar: React.FC = () => {
  const { isMobileSidebarOpen, isDesktopSidebarOpen, toggleMobileSidebar } =
    useSidebarStore();

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (isMobile) {
    return (
      <Sheet open={isMobileSidebarOpen} onOpenChange={toggleMobileSidebar}>
        <SheetContent side="left" className="w-[280px] overflow-hidden p-0">
          <SideBarContent noButton />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "flex w-[280px] border-r bg-card transition-all",
        !isDesktopSidebarOpen && "w-0 border-none",
      )}
    >
      <SideBarContent />
    </aside>
  );
};

export default SideBar;
