import React from "react";
import { cn } from "@/app/lib/utils";
import { formatWeight } from "@/app/lib/utils";
import Gripper from "@/app/components/base/gripper";
import useMutations from "@/app/hooks/use-mutations";
import type { ItemSelect } from "@/api/lib/types";
import invariant from "tiny-invariant";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/app/hooks/use-draggable-state";
import { createPortal } from "react-dom";
import { DND_ENTITY_TYPE, DndEntityType } from "@/app/lib/constants";
import useCurrentList from "@/app/hooks/use-current-list";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Copy, Delete, MoreHorizontal } from "lucide-react";
import ConfirmDeleteDialog from "../base/confirm-delete-dialog";
import { toast } from "sonner";

interface Props {
  item: ItemSelect;
  isOverlay?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const PackingItem: React.FC<Props> = (props) => {
  const { item, isOverlay } = props;
  const { deleteItem } = useMutations();

  const { listItemIds } = useCurrentList();
  const isIncludedInList = listItemIds.has(item.id);

  const ref = React.useRef<HTMLDivElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);

  const itemName = item.name || "Unnamed Gear";

  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    const gripper = gripperRef.current;
    invariant(element);
    invariant(gripper);

    return draggable({
      element: gripper,
      canDrag: () => !isIncludedInList,
      getInitialData: () => ({
        [DND_ENTITY_TYPE]: DndEntityType.Item,
        ...item,
      }),
      onGenerateDragPreview({ nativeSetDragImage }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: pointerOutsideOfPreview({
            x: "-16px",
            y: "-16px",
          }),
          render({ container }) {
            setDraggableState({ type: "preview", container });
          },
        });
      },
      onDragStart() {
        setDraggableState({ type: "is-dragging" });
      },
      onDrop() {
        setDraggableIdle();
      },
    });
  }, [item, isIncludedInList]);

  return (
    <>
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDelete={() => deleteItem.mutate({ itemId: item.id, itemName })}
        entityName="gear"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={ref}
            data-item-id={item.id}
            className={cn(
              "flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-secondary",
              draggableStyles[draggableState.type],
              isOverlay && "w-64 rounded border bg-card",
              isIncludedInList && "opacity-50",
            )}
          >
            <Gripper reference={gripperRef} />
            <div className="flex flex-1 flex-col">
              <span
                className={cn(!item.name && "italic text-muted-foreground")}
              >
                {itemName}
              </span>
              <span className="text-muted-foreground">{item.description}</span>
            </div>
            <span className="flex gap-1 text-muted-foreground">
              <span>{formatWeight(item.weight)}</span>
              <span>{item.weightUnit}</span>
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn("h-6 w-6 rounded-full p-0 hover:bg-muted")}
                  title="List Actions"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Delete size="1rem" className="mr-2" />
                  Delete Gear
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled
                  onClick={() => toast("Feature not implemented yet")}
                >
                  <Copy size="1rem" className="mr-2" />
                  Duplicate Gear
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipTrigger>
        {isIncludedInList && (
          <TooltipContent side="right">Already added to list</TooltipContent>
        )}
      </Tooltip>
      {draggableState.type === "preview"
        ? createPortal(
            <PackingItem item={item} isOverlay />,
            draggableState.container,
          )
        : null}
    </>
  );
};

export default PackingItem;
