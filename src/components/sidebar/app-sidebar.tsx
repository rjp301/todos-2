import React from "react";
import PackingItems from "../packing-items/packing-items";
import PackingLists from "../packing-lists/packing-lists";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { NAVBAR_HEIGHT } from "@/lib/constants";

import { Heading } from "@radix-ui/themes";
import UserAvatar from "../user-avatar";

const AppSideBar: React.FC = () => {
  // const { toggleSidebar } = useSidebar();

  // useEventListener("keydown", (e) => {
  //   if (getIsTyping() || getHasModifier(e)) return;
  //   if (e.code === "KeyB") {
  //     toggleSidebar();
  //   }
  // });

  return (
    <div
      className="z-0 flex h-screen w-[20rem] outline-none p-2"
      style={
        {
          "--initial-transform": "calc(100% + 8px)",
        } as React.CSSProperties
      }
    >
      <div className="flex h-full w-full grow flex-col rounded-[16px] border bg-gray-2">
        <header
          className="flex items-center justify-between border-b px-4"
          style={{ height: NAVBAR_HEIGHT }}
        >
          <Heading asChild weight="bold" size="5">
            <a href="/" className="text-xl flex items-center gap-3">
              <i className="fa-solid fa-earth text-accentA-10" />
              LighterTravel
            </a>
          </Heading>
          <UserAvatar />
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
    </div>
  );
};

export default AppSideBar;
