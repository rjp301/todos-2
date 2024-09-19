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
      <h2 className="text-xs font-bold uppercase text-secondary-foreground/70">
        {title}
      </h2>
      {action && <Button size="sm" variant="linkMuted" {...action} />}
    </header>
  );
};

export default SidebarSectionHeader;
