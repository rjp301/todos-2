import { cn } from "@/lib/utils";
import React from "react";

type Props = React.PropsWithChildren<{
  width?: React.CSSProperties["width"];
  center?: boolean;
  className?: string;
}>;

const CellWrapper: React.FC<Props> = (props) => {
  const { children, width, center, className } = props;
  return (
    <span
      className={cn(
        "flex flex-shrink-0 items-center gap-1",
        center && "justify-center",
        className,
      )}
      style={{ width }}
    >
      {children}
    </span>
  );
};

export default CellWrapper;
