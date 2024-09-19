import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface Props {
  url: string | undefined | null;
  size: "lg" | "sm";
  className?: string;
}

const ItemImage: React.FC<Props> = (props) => {
  const { url, size = "sm", className } = props;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-muted-foreground",
        url ? "bg-white" : "bg-muted",
        size === "lg" ? "rounded-md p-2" : "rounded-sm p-0.5",
        className,
      )}
    >
      {url ? (
        <Avatar className="h-full w-full rounded-none bg-none">
          <AvatarImage src={url} />
          <AvatarFallback className="rounded-none bg-white text-destructive">
            {size === "lg" ? (
              <div className="flex flex-col items-center gap-1">
                <i className="fa-solid fa-exclamation-triangle text-xl" />
                <span>Invalid URL</span>
              </div>
            ) : (
              <i className="fa-solid fa-exclamation-triangle text-xl"></i>
            )}
          </AvatarFallback>
        </Avatar>
      ) : size === "lg" ? (
        "No Image"
      ) : null}
    </div>
  );
};

export default ItemImage;
