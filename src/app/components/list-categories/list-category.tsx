import React from "react";

import { cn } from "@/app/lib/utils";
import type { ExpandedCategory } from "@/api/lib/types";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/app/hooks/use-draggable-state";
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
import { createPortal } from "react-dom";
import { DropIndicator } from "../ui/drop-indicator";
import {
  DND_ENTITY_TYPE,
  DndEntityType,
  isDndEntityType,
} from "@/app/lib/constants";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useColumns from "./use-columns";
import ListCategoryItem from "./list-category-item";
import useTableState from "./use-table-state";

interface Props {
  category: ExpandedCategory;
  isOverlay?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const ListCategory: React.FC<Props> = (props) => {
  const { category, isOverlay } = props;

  const ref = React.useRef<HTMLDivElement>(null);
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
          [DND_ENTITY_TYPE]: DndEntityType.Category,
          ...category,
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
          if (source.data.id === category.id) {
            return false;
          }
          // only allowing tasks to be dropped on me
          return isDndEntityType(source.data, DndEntityType.Category);
        },
        getData({ input }) {
          return attachClosestEdge(category, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self, source }) {
          if (!isDndEntityType(source.data, DndEntityType.Category)) return;
          const closestEdge = extractClosestEdge(self.data);
          setDraggableState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self, source }) {
          if (!isDndEntityType(source.data, DndEntityType.Category)) return;
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
  }, [category]);

  const columns = useColumns(category, gripperRef);
  const { columnVisibility } = useTableState();
  const table = useReactTable({
    data: category.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  });

  return (
    <>
      <div
        ref={ref}
        key={category.id}
        data-category-id={category.id}
        className={cn(
          "relative flex w-full flex-col",
          isOverlay && "w-[800px] rounded border bg-card",
          draggableStyles[draggableState.type],
        )}
      >
        <header className="w-full border-b text-sm font-semibold text-muted-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              className="flex h-10 w-full items-center gap-1 px-2 text-sm transition-colors hover:bg-muted/50"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => (
                <React.Fragment key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </header>
        <section>
          {table.getRowModel().rows.map((row) => (
            <ListCategoryItem key={row.id} row={row} />
          ))}
        </section>
        <footer>
          {table.getFooterGroups().map((footerGroup) => (
            <div
              key={footerGroup.id}
              className="flex h-12 w-full items-center gap-1 px-2 text-sm transition-colors hover:bg-muted/50"
            >
              {footerGroup.headers.map((header) => (
                <React.Fragment key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </footer>
        {draggableState.type === "is-dragging-over" &&
        draggableState.closestEdge ? (
          <DropIndicator edge={draggableState.closestEdge} gap={"1rem"} />
        ) : null}
      </div>
      {draggableState.type === "preview"
        ? createPortal(
            <ListCategory category={category} isOverlay />,
            draggableState.container,
          )
        : null}
    </>
  );
};

export default ListCategory;
