import React from "react";
import { cn } from "@/lib/utils";

import type { ExpandedCategoryItem } from "@/lib/types";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/hooks/use-draggable-state";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from "tiny-invariant";
import {
  DND_ENTITY_TYPE,
  DndEntityType,
  isDndEntityType,
} from "@/lib/constants";
import useCurrentList from "@/hooks/use-current-list";
import { flexRender, type Row } from "@tanstack/react-table";
import { DropIndicator } from "../ui/drop-indicator";
import Gripper from "../base/gripper";
import { Portal, Separator } from "@radix-ui/themes";
import RadixProvider from "../base/radix-provider";

interface Props {
  row: Row<ExpandedCategoryItem>;
  isOverlay?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const isPermitted = (
  data: Record<string, unknown>,
  listItemIds: Set<string>,
) => {
  if (
    isDndEntityType(data, DndEntityType.Item) &&
    listItemIds.has(data.id as string)
  ) {
    return false;
  }
  const entities = [DndEntityType.CategoryItem, DndEntityType.Item];
  return entities.some((entity) => isDndEntityType(data, entity));
};

const EditorCategoryItem: React.FC<Props> = (props) => {
  const { row, isOverlay } = props;
  const { list, listItemIds, duplicateListItemIds } = useCurrentList();

  const ref = React.useRef<HTMLTableRowElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);

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
        getInitialData: () => ({
          [DND_ENTITY_TYPE]: DndEntityType.CategoryItem,
          ...row.original,
        }),
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
          if (source.data.id === row.original.id) {
            return false;
          }
          return isPermitted(source.data, listItemIds);
        },
        getData({ input }) {
          return attachClosestEdge(row.original, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self, source }) {
          if (!isPermitted(source.data, listItemIds)) return;
          const closestEdge = extractClosestEdge(self.data);
          setDraggableState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self, source }) {
          if (!isPermitted(source.data, listItemIds)) return;
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
  }, [row.original]);

  const isDuplicate = duplicateListItemIds.has(row.original.itemId);

  if (!list) return null;

  return (
    <>
      <div
        ref={ref}
        data-category-item-id={row.original.id}
        className={cn(
          "text-sm relative flex h-fit items-center gap-1 px-2 py-1 transition-colors hover:bg-gray-3",
          isOverlay && "w-[800px] rounded-2 border bg-gray-2",
          draggableStyles[draggableState.type],
          isDuplicate && "bg-red-2 hover:bg-red-3",
        )}
      >
        {row.getVisibleCells().map((cell) => (
          <React.Fragment key={cell.id}>
            {cell.column.columnDef.meta?.isGripper && (
              <Gripper ref={gripperRef} />
            )}
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </React.Fragment>
        ))}
        {draggableState.type === "is-dragging-over" &&
        draggableState.closestEdge ? (
          <DropIndicator edge={draggableState.closestEdge} gap="1px" />
        ) : null}
      </div>
      {draggableState.type === "preview" ? (
        <Portal container={draggableState.container}>
          <RadixProvider>
            <EditorCategoryItem row={row} isOverlay />
          </RadixProvider>
        </Portal>
      ) : null}
      {!isOverlay && <Separator size="4" />}
    </>
  );
};

export default EditorCategoryItem;
