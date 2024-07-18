import type { ItemSelect } from "@/api/lib/types";
import React from "react";

type Props = {
  imageRef: React.RefObject<HTMLDivElement>;
  item: ItemSelect;
};

const PackingItemDragImage: React.FC<Props> = (props) => {
  const { item, imageRef } = props;

  return (
    <div ref={imageRef} className="absolute left-[-1000px] z-50 bg-red-500">
      {item.name}
    </div>
  );
};

export default PackingItemDragImage;
