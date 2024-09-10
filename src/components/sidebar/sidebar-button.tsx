import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import useSidebarStore from "./store";
import { MOBILE_MEDIA_QUERY, NAVBAR_HEIGHT } from "@/lib/constants";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  hideWhenSidebarOpen?: boolean;
}

const SidebarButton: React.FC<Props> = ({ hideWhenSidebarOpen }) => {
  const { toggleDesktopSidebar, toggleMobileSidebar, isDesktopSidebarOpen } =
    useSidebarStore();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const isHidden = hideWhenSidebarOpen && isDesktopSidebarOpen && !isMobile;

  return (
    <div
      className={cn(
        "w-14 overflow-hidden transition-all ease-out",
        isHidden && "w-0 opacity-0",
      )}
    >
      <Button
        size="icon"
        className={cn("w-14 rounded-none transition-all")}
        style={{ height: NAVBAR_HEIGHT }}
        variant="ghost"
        onClick={() =>
          isMobile ? toggleMobileSidebar() : toggleDesktopSidebar()
        }
      >
        <Menu size="1.2rem" />
      </Button>
    </div>
  );
};

export default SidebarButton;
