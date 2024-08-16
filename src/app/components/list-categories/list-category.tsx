import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Checkbox } from "@/app/components/ui/checkbox";
import DeleteButton from "@/app/components/base/delete-button";
import Gripper from "@/app/components/base/gripper";

import { cn } from "@/app/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import ServerInput from "@/app/components/input/server-input";
import { formatWeight } from "@/app/lib/utils";
import useListId from "@/app/hooks/use-list-id";
import { listQueryOptions } from "@/app/lib/queries";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import useMutations from "@/app/hooks/use-mutations";
import CategoryItem from "./list-category-item";
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

interface Props {
  category: ExpandedCategory;
  isOverlay?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const ListCategory: React.FC<Props> = (props) => {
  const { category, isOverlay } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

  const list = queryClient.getQueryData(listQueryOptions(listId).queryKey);

  const {
    deleteCategory,
    toggleCategoryPacked,
    updateCategory,
    addCategoryItem: addItemToCategory,
  } = useMutations();

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

  if (!list) return null;

  return (
    <>
      <div
        ref={ref}
        key={category.id}
        data-category-id={category.id}
        className={cn(
          "relative",
          isOverlay && "w-[800px] rounded border bg-card",
          draggableStyles[draggableState.type],
        )}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {list.showPacked && (
                <TableHead className="w-6">
                  <Checkbox
                    checked={category.packed}
                    onCheckedChange={() =>
                      toggleCategoryPacked.mutate({ categoryId: category.id })
                    }
                  />
                </TableHead>
              )}
              <TableHead className="w-4 px-1">
                <Gripper reference={gripperRef} isGrabbing={isOverlay} />
              </TableHead>
              <TableHead
                colSpan={2 + (list.showImages ? 1 : 0)}
                className="text-foregound px-1 text-base font-semibold"
              >
                <ServerInput
                  inline
                  className="py-0.5 text-base"
                  placeholder="Category Name"
                  currentValue={category.name ?? ""}
                  onUpdate={(value) =>
                    updateCategory.mutate({
                      categoryId: category.id,
                      data: { name: value },
                    })
                  }
                />
              </TableHead>
              {list.showWeights && (
                <TableHead className="w-[7rem] text-center">Weight</TableHead>
              )}
              <TableHead className="w-[5rem]">Qty</TableHead>
              <TableHead className="w-6 pl-0">
                <DeleteButton
                  handleDelete={() =>
                    deleteCategory.mutate({
                      categoryId: category.id,
                      categoryName: category.name,
                    })
                  }
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.items.map((item) => (
              <CategoryItem key={item.id} categoryItem={item} />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={
                  3 + (list.showPacked ? 1 : 0) + (list.showImages ? 1 : 0)
                }
              >
                <Button
                  variant="linkMuted"
                  size="sm"
                  onClick={() =>
                    addItemToCategory.mutate({ categoryId: category.id })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </TableCell>
              {list.showWeights && (
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <span>{formatWeight(category.weight)}</span>
                    <span className="min-w-8">{list.weightUnit ?? "g"}</span>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="pl-2">
                  {category.items.reduce((acc, val) => acc + val.quantity, 0)}
                </div>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
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
