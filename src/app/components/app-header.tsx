import React from "react";
import UserAvatar from "@/app/components/user-avatar";
import SidebarButton from "./sidebar/sidebar-button";
import { NAVBAR_HEIGHT } from "../lib/constants";

type Props = React.PropsWithChildren;

const AppHeader: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <header
      className="flex items-center border-b"
      style={{ height: NAVBAR_HEIGHT }}
    >
      <SidebarButton hideWhenSidebarOpen />
      <div className="flex w-full items-center gap-4 p-4">
        <div className="flex flex-1 items-center justify-between">
          {children}
        </div>
        <UserAvatar />
      </div>
    </header>
  );
};

export default AppHeader;
