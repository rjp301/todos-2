import { cn } from "@/app/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import invariant from "tiny-invariant";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import { MoreHorizontal, Delete, Copy } from "lucide-react";
import { Button } from "@/app/components/ui/button";

import Gripper from "@/app/components/base/gripper";
import { useSidebarStore } from "@/app/components/sidebar/sidebar-store";
import { Link } from "@tanstack/react-router";
import useMutations from "@/app/hooks/use-mutations";
import type { ListSelect } from "@/api/lib/types";
import useListId from "@/app/hooks/use-list-id";
import ConfirmDeleteDialog from "../base/confirm-delete-dialog";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/app/hooks/use-draggable-state";
import { isEntity } from "@/app/lib/validators";
import { DropIndicator } from "../ui/drop-indicator";
import { createPortal } from "react-dom";

interface Props {
  list: ListSelect;
  isPreview?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const PackingList: React.FC<Props> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);

  const { list, isPreview } = props;
  const listId = useListId();

  const isActive = listId === list.id;

  const { deleteList, duplicateList } = useMutations();
  const { toggleMobileSidebar } = useSidebarStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  React.useEffect(() => {
    const element = ref.current;
    const gripper = gripperRef.current;
    invariant(element);
    invariant(gripper);

    return combine(
      draggable({
        element: gripper,
        getInitialData: () => list,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
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
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          // not allowing dropping on yourself
          if (source.element === element) {
            return false;
          }
          // only allowing tasks to be dropped on me
          return isEntity<ListSelect>(source.data);
        },
        getData({ input }) {
          return attachClosestEdge(list, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setDraggableState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          // Only need to update react state if nothing has changed.
          // Prevents re-rendering.
          setDraggableState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },
        onDragLeave() {
          setDraggableIdle();
        },
        onDrop() {
          setDraggableIdle();
        },
      }),
    );
  }, [list]);

  return (
    <>
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDelete={() => deleteList.mutate({ listId: list.id })}
        entityName="packing list"
      />
      <div
        ref={ref}
        data-list-id={list.id}
        className={cn(
          "flex items-center gap-2 border-l-4 border-transparent py-0.5 pl-2 pr-2 hover:border-muted",
          draggableStyles[draggableState.type],
          isPreview &&
            "w-64 rounded border border-l-4 border-border bg-card",
          isActive &&
            "border-primary bg-secondary text-secondary-foreground hover:border-primary",
          "relative",
        )}
      >
        <Gripper reference={gripperRef} />
        <Link
          to={`/list/$listId`}
          params={{ listId: list.id }}
          onClick={() => toggleMobileSidebar(false)}
          className={cn(
            "flex-1 truncate text-sm",
            !list.name && "italic text-muted-foreground",
          )}
        >
          {list.name || "Unnamed List"}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn("h-8 w-8 p-0")}
              title="List Actions"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              <Delete size="1rem" className="mr-2" />
              Delete List
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => duplicateList.mutate({ listId: list.id })}
            >
              <Copy size="1rem" className="mr-2" />
              Duplicate List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {draggableState.type === "is-dragging-over" &&
        draggableState.closestEdge ? (
          <DropIndicator edge={draggableState.closestEdge} gap={"0px"} />
        ) : null}
      </div>
      {draggableState.type === "preview"
        ? createPortal(
            <PackingList list={list} isPreview />,
            draggableState.container,
          )
        : null}
    </>
  );
};

export default PackingList;
