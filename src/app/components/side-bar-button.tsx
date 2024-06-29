import React from "react";
import { Button } from "@/app/components/ui/button.tsx";
import { Menu } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useStore } from "@/app/lib/store";
import { MOBILE_MEDIA_QUERY } from "@/app/lib/constants";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  hideWhenSidebarOpen?: boolean;
}

const SidebarButton: React.FC<Props> = ({ hideWhenSidebarOpen }) => {
  const { toggleDesktopSidebar, toggleMobileSidebar, isDesktopSidebarOpen } =
    useStore();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (hideWhenSidebarOpen && isDesktopSidebarOpen && !isMobile) {
    return null;
  }

  return (
    <Button
      size="icon"
      className={cn("h-14 w-14 rounded-none transition-all")}
      variant="ghost"
      onClick={() =>
        isMobile ? toggleMobileSidebar() : toggleDesktopSidebar()
      }
    >
      <Menu size="1.2rem" />
    </Button>
  );
};

export default SidebarButton;
