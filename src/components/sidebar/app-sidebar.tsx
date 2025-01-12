import React from "react";
import PackingItems from "../packing-items/packing-items";
import PackingLists from "../packing-lists/packing-lists";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { NAVBAR_HEIGHT } from "@/lib/constants";

import UserAvatar from "../user-avatar";
import Logo from "../logo";
import { Button, IconButton } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "./store";
import { cn } from "@/lib/utils";

const AppSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom);

  // useEventListener("keydown", (e) => {
  //   if (getIsTyping() || getHasModifier(e)) return;
  //   if (e.code === "KeyB") {
  //     toggleSidebar();
  //   }
  // });

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 p-2">
      <div className="overflow-hidden">
        <div
          className={cn(
            "z-0 flex h-screen w-[20rem] outline-none",
            !isOpen && "w-0",
          )}
        >
          <div className="relative flex h-full w-full grow flex-col rounded-4 border bg-panel">
            <header
              className="flex items-center justify-between border-b px-4"
              style={{ height: NAVBAR_HEIGHT }}
            >
              <Logo />
              <UserAvatar />
            </header>
            <ResizablePanelGroup
              autoSaveId="sidebar-panels"
              direction="vertical"
            >
              <ResizablePanel defaultSize={40}>
                <PackingLists />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <PackingItems />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
      <IconButton
        variant="ghost"
        size="1"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-4 h-1/2"
      >
        <i className="fa-solid fa-chevron-left text-1" />
      </IconButton>
    </div>
  );
};

export default AppSideBar;
