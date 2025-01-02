import { cn, getHasModifier, getIsTyping } from "@/lib/utils";
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
import { Drawer } from "vaul";
import { Portal } from "@radix-ui/themes";
import RadixProvider from "../base/radix-provider";

const AppSideBar: React.FC = () => {
  // const { toggleSidebar } = useSidebar();

  // useEventListener("keydown", (e) => {
  //   if (getIsTyping() || getHasModifier(e)) return;
  //   if (e.code === "KeyB") {
  //     toggleSidebar();
  //   }
  // });

  return (
    <Drawer.Root direction="right" open>
      <Portal>
        <RadixProvider>
          <Drawer.Content
            className="fixed bottom-2 right-2 top-2 z-10 flex w-[310px] outline-none"
            style={
              {
                "--initial-transform": "calc(100% + 8px)",
              } as React.CSSProperties
            }
          >
            <div className="flex h-full w-full grow flex-col rounded-[16px] border bg-gray-1">
              <header
                style={{ height: NAVBAR_HEIGHT }}
              >
                <Logo />
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
          </Drawer.Content>
        </RadixProvider>
      </Portal>
    </Drawer.Root>
  );
};

export default AppSideBar;
