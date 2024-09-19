import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface Props {
  url: string | undefined | null;
  size: "lg" | "sm";
  className?: string;
}

const NoImage: React.FC<Props> = (props) => {
  const { size } = props;
  if (size === "sm") return null;
  return "No Image";
};

const InvalidUrl: React.FC<Props> = (props) => {
  const { size } = props;
  if (size === "sm") {
    return (
      <i className="fa-solid fa-exclamation-triangle text-xl text-destructive"></i>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1 text-destructive">
      <i className="fa-solid fa-exclamation-triangle text-xl" />
      <span>Invalid URL</span>
    </div>
  );
};

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
        <Avatar className="h-full w-full rounded-none">
          <AvatarImage src={url} className="aspect-auto object-contain" />
          <AvatarFallback className="rounded-none bg-white text-destructive">
            <InvalidUrl {...props} />
          </AvatarFallback>
        </Avatar>
      ) : (
        <NoImage {...props} />
      )}
    </div>
  );
};

export default ItemImage;
