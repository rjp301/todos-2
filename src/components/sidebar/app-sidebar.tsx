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
import { useAtom } from "jotai";
import { desktopSidebarOpenAtom, mobileSidebarOpenAtom } from "./store";
import { cn, getHasModifier, getIsTyping } from "@/lib/utils";
import { useEventListener } from "usehooks-ts";
import { useIsMobile } from "@/hooks/use-is-mobile";

const AppSideBar: React.FC = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useAtom(
    isMobile ? mobileSidebarOpenAtom : desktopSidebarOpenAtom,
  );

  useEventListener("keydown", (e) => {
    if (getIsTyping() || getHasModifier(e)) return;
    if (e.code === "KeyB") {
      setIsOpen((prev) => !prev);
    }
    if (isMobile && e.code === "Escape") {
      setIsOpen(false);
    }
  });

  return (
    <>
      {!isMobile && (
        <div
          className={cn(
            "transition-all duration-200 ease-in-out",
            isOpen ? "w-[20rem]" : "w-0",
          )}
        />
      )}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-10 bg-panel-translucent backdrop-blur"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed bottom-0 left-0 top-0 z-20 w-[20rem] p-2 transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative flex h-full w-full flex-col rounded-4 border bg-panel-solid">
          <header
            className="flex items-center justify-between border-b px-4"
            style={{ height: NAVBAR_HEIGHT }}
          >
            <Logo />
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
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "absolute bottom-12 top-12 w-3 border bg-panel-solid opacity-0 transition-opacity duration-200 ease-in-out hover:opacity-100",
            isOpen
              ? "-right-1.5 rounded-full"
              : "-right-3 rounded-r-full border-l-0",
          )}
        />
      </div>
    </>
  );
};

export default AppSideBar;
