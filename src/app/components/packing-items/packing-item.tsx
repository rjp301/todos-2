import React from "react";
import DeleteButton from "@/components/base/delete-button";
import { cn } from "@/lib/utils";
import { formatWeight } from "@/app/lib/helpers";
import Gripper from "@/components/base/gripper";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
// import { type ActiveDraggable } from "../app-dnd-wrapper";
import type { Item } from "astro:db";
import useMutations from "@/app/hooks/useMutations";

interface Props {
  item: typeof Item.$inferSelect;
  isOverlay?: boolean;
}

const PackingItem: React.FC<Props> = (props) => {
  const { item, isOverlay } = props;
  const { deleteItem } = useMutations();

  // const sortableData: ActiveDraggable = {
  //   type: "item",
  //   data: item,
  // };

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    // data: sortableData,
  });

  const itemName = item.name || "Unnamed Gear";

  const style = { transform: CSS.Translate.toString(transform) };


  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-secondary",
        isOverlay && "rounded outline outline-1 outline-ring",
      )}
    >
      <Gripper {...attributes} {...listeners} />
      <div className="flex flex-1 flex-col">
        <span className={cn(!item.name && "italic text-muted-foreground")}>
          {itemName}
        </span>
        <span className="text-muted-foreground">{item.description}</span>
      </div>
      <span className="flex gap-1 text-muted-foreground">
        <span>{formatWeight(item.weight)}</span>
        <span>{item.weightUnit}</span>
      </span>
      <DeleteButton
        handleDelete={() =>
          deleteItem.mutate({ itemId: item.id, itemName: itemName })
        }
      />
    </div>
  );
};

export default PackingItem;
