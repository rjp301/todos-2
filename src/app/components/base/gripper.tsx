import { cn } from "@/app/lib/utils";
import { GripVertical } from "lucide-react";
import React from "react";

type Props = {
  isGrabbing?: boolean;
  disabled?: boolean;
};

const Gripper = React.forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    const { isGrabbing, disabled, ...rest } = props;

    return (
      <button
        ref={ref}
        {...(disabled ? { disabled: true } : rest)}
        className={cn(
          "flex cursor-grab items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
          isGrabbing && "cursor-grabbing",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <GripVertical size="1rem" />
      </button>
    );
  },
);

export default Gripper;
