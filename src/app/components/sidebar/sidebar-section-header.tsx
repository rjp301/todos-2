import React from "react";
import { Button, type ButtonProps } from "../ui/button";

type Props = {
  title: string;
  action?: ButtonProps;
};

const SidebarSectionHeader: React.FC<Props> = (props) => {
  const { title, action } = props;

  return (
    <header className="flex items-center justify-between gap-2">
      <h2 className="text-sm text-secondary-foreground upper font-medium">{title}</h2>
      {action && <Button size="sm" variant="linkMuted" {...action} />}
    </header>
  );
};

export default SidebarSectionHeader;
