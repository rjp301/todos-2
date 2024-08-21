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
import useCurrentList from "@/app/hooks/use-current-list";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useColumns from "./use-columns";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ListCategoryItemNew from "./list-category-item-new";

interface Props {
  category: ExpandedCategory;
  isOverlay?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const ListCategoryNew: React.FC<Props> = (props) => {
  const { category, isOverlay } = props;
  const { list } = useCurrentList();

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
          if (source.element === element) {
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
  const table = useReactTable({
    data: category.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!list) return null;

  return (
    <>
      <div
        ref={ref}
        key={category.id}
        data-category-id={category.id}
        className={cn(
          "relative w-full",
          isOverlay && "w-[800px] rounded border bg-card",
          draggableStyles[draggableState.type],
        )}
      >
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <ListCategoryItemNew row={row} />
            ))}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
        {draggableState.type === "is-dragging-over" &&
        draggableState.closestEdge ? (
          <DropIndicator edge={draggableState.closestEdge} gap={"1rem"} />
        ) : null}
      </div>
      {draggableState.type === "preview"
        ? createPortal(
            <ListCategoryNew category={category} isOverlay />,
            draggableState.container,
          )
        : null}
    </>
  );
};

export default ListCategoryNew;