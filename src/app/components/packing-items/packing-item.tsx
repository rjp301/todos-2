import React from "react";
import DeleteButton from "@/components/base/delete-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatWeight } from "@/app/lib/helpers";
import Gripper from "@/components/base/gripper";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
// import { type ActiveDraggable } from "../app-dnd-wrapper";
import useListId from "@/app/hooks/useListId";
import type { Item } from "@/api/db/schema";
import { api } from "@/lib/client";
import { itemsQueryOptions, listQueryOptions } from "@/app/lib/queries";

interface Props {
  item: Item;
  isOverlay?: boolean;
}

const PackingItem: React.FC<Props> = (props) => {
  const { item, isOverlay } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

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

  const deleteToastId = React.useRef<string | number | undefined>(undefined);

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) =>
      api.items.delete.$post({ json: { id: itemId } }),
    onMutate: () => {
      deleteToastId.current = toast.loading("Deleting item...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsQueryOptions.queryKey });
      queryClient.invalidateQueries({
        queryKey: listQueryOptions(listId).queryKey,
      });
      toast.success(`${itemName} deleted successfully`, {
        id: deleteToastId.current,
      });
    },
    onError: (error) => {
      toast.error(error.message, { id: deleteToastId.current });
    },
  });

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
      <DeleteButton handleDelete={() => deleteItemMutation.mutate(item.id)} />
    </div>
  );
};

export default PackingItem;
