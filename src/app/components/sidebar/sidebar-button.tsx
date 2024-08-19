import React from "react";
import { Button } from "@/app/components/ui/button.tsx";
import { Menu } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useSidebarStore } from "./sidebar-store";
import { MOBILE_MEDIA_QUERY, NAVBAR_HEIGHT } from "@/app/lib/constants";
import { useMediaQuery } from "usehooks-ts";

const SidebarButton: React.FC = () => {
  const { toggleDesktopSidebar, toggleMobileSidebar } = useSidebarStore();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
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
  );
};

export default SidebarButton;
