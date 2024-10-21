import React from "react";
import UserAvatar from "@/components/user-avatar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

type Props = React.PropsWithChildren;

const AppHeader: React.FC<Props> = (props) => {
  const { children } = props;

  const { toggleSidebar } = useSidebar();

  return (
    <header
      className="flex items-center border-b"
      style={{ height: NAVBAR_HEIGHT }}
    >
      <div className="container2 flex items-center gap-2">
        <Button
          size="icon"
          className="w-14 rounded-none transition-all"
          style={{ height: NAVBAR_HEIGHT }}
          variant="ghost"
          onClick={() => toggleSidebar()}
        >
          <Menu size="1.2rem" />
        </Button>
        <div className="flex w-full items-center gap-4">
          <div className="flex flex-1 items-center justify-between gap-2">
            {children}
          </div>
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
