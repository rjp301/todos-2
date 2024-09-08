import React from "react";
import { Button, type ButtonProps } from "../ui/button";

type Props = {
  title: string;
  action?: ButtonProps;
};

const SidebarSectionHeader: React.FC<Props> = (props) => {
  const { title, action } = props;

  return (
    <header className="flex h-6 items-center justify-between gap-2">
      <h2 className="upper text-sm font-medium text-secondary-foreground">
        {title}
      </h2>
      {action && <Button size="sm" variant="linkMuted" {...action} />}
    </header>
  );
};

export default SidebarSectionHeader;
