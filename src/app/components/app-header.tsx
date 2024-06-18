import React from "react";
import UserAvatar from "@/components/user-avatar.tsx";
import SidebarButton from "./side-bar-button";

type Props = React.PropsWithChildren;

const AppHeader: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <header className="flex h-14 items-center border-b">
      <SidebarButton />
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
