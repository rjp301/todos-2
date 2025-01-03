import React from "react";
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

// const InvalidUrl: React.FC<Props> = (props) => {
//   const { size } = props;
//   if (size === "sm") {
//     return (
//       <i className="fa-solid fa-exclamation-triangle text-xl text-destructive"></i>
//     );
//   }
//   return (
//     <div className="flex flex-col items-center gap-1 text-destructive">
//       <i className="fa-solid fa-exclamation-triangle text-xl" />
//       <span>Invalid URL</span>
//     </div>
//   );
// };

const ItemImage: React.FC<Props> = (props) => {
  const { url, size = "sm", className } = props;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-gray-10",
        url ? "bg-[white]" : "bg-gray-4",
        size === "lg" ? "rounded-3 p-2" : "rounded-2 p-0.5",
        className,
      )}
    >
      {url ? (
        <img src={url} className="h-full w-full object-contain" />
      ) : (
        <NoImage {...props} />
      )}
    </div>
  );
};

export default ItemImage;
