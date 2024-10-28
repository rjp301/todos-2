import React from "react";
import { Button, type ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  action?: ButtonProps;
  count?: number;
};

const SidebarSectionHeader: React.FC<Props> = (props) => {
  const { title, action, count } = props;

  return (
    <header className="flex h-6 items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-secondary-foreground/90">
        <h2>{title}</h2>
        <span className="text-secondary-foreground/60">{count}</span>
      </div>
      {action && (
        <Button
          size="sm"
          variant="linkMuted"
          {...action}
          className={cn(action.className, "px-0")}
        />
      )}
    </header>
  );
};

export default SidebarSectionHeader;
