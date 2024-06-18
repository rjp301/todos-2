import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/app/lib/store";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  closeAction?: boolean;
}

const SidebarButton: React.FC<Props> = (props) => {
  const { closeAction } = props;
  const { isSidebarOpen, toggleSidebar } = useStore();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  return (
    <div
      className={cn(
        "flex-shrink overflow-hidden",
        !isMobile && isSidebarOpen && !closeAction && "w-0",
      )}
    >
      <Button
        size="icon"
        className={cn("h-14 w-14 rounded-none transition-all")}
        variant="ghost"
        onClick={() => toggleSidebar()}
      >
        <Menu size="1.2rem" />
      </Button>
    </div>
  );
};

export default SidebarButton;
