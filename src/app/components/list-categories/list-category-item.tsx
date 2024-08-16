import React from "react";
import { TableCell, TableRow } from "@/app/components/ui/table";
import Gripper from "@/app/components/base/gripper";
import { Checkbox } from "@/app/components/ui/checkbox";
import ServerInput from "@/app/components/input/server-input";
import DeleteButton from "@/app/components/base/delete-button";
import { useQueryClient } from "@tanstack/react-query";
import ItemImage from "@/app/components/item-image";
import { cn } from "@/app/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import useListId from "@/app/hooks/use-list-id";

import { listQueryOptions } from "@/app/lib/queries";
import { weightUnits, type WeightUnit } from "@/api/helpers/weight-units";
import useMutations from "@/app/hooks/use-mutations";
import type { ExpandedCategoryItem } from "@/api/lib/types";
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
  categoryItem: ExpandedCategoryItem;
  isOverlay?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const isPermitted = (data: Record<string, unknown>) => {
  const entities = [DndEntityType.CategoryItem, DndEntityType.Item];
  return entities.some((entity) => isDndEntityType(data, entity));
};

const ListCategoryItem: React.FC<Props> = (props) => {
  const { categoryItem, isOverlay } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

  const list = queryClient.getQueryData(listQueryOptions(listId).queryKey);

  const { deleteCategoryItem, updateCategoryItem, updateItem } = useMutations();

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
          ...categoryItem,
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
          return isPermitted(source.data);
        },
        getData({ input }) {
          return attachClosestEdge(categoryItem, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self, source }) {
          if (!isPermitted(source.data)) return;
          const closestEdge = extractClosestEdge(self.data);
          setDraggableState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self, source }) {
          if (!isPermitted(source.data)) return;
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
  }, [categoryItem]);

  if (!list) return null;

  return (
    <>
      <TableRow
        ref={ref}
        className={cn(
          "relative",
          isOverlay && "w-[800px] rounded border bg-card",
          draggableStyles[draggableState.type],
        )}
      >
        {list.showPacked && (
          <TableCell className="py-0">
            <Checkbox
              checked={categoryItem.packed}
              onCheckedChange={(packed) =>
                updateCategoryItem.mutate({
                  categoryItemId: categoryItem.id,
                  categoryId: categoryItem.categoryId,
                  data: { packed: Boolean(packed) },
                })
              }
            />
          </TableCell>
        )}
        <TableCell className="w-4 px-1 py-0.5">
          <Gripper reference={gripperRef} />
        </TableCell>
        {list.showImages && (
          <TableCell>
            <div
              className={cn(!categoryItem.itemData.image && "absolute inset-2")}
            >
              <ItemImage item={categoryItem.itemData} />
            </div>
          </TableCell>
        )}
        <TableCell className="px-1 py-0.5">
          <ServerInput
            inline
            placeholder="Name"
            currentValue={categoryItem.itemData.name}
            onUpdate={(name) =>
              updateItem.mutate({
                itemId: categoryItem.itemData.id,
                data: { name },
              })
            }
          />
        </TableCell>
        <TableCell className="w-1/2 px-1 py-0.5 text-muted-foreground">
          <ServerInput
            inline
            placeholder="Description"
            currentValue={categoryItem.itemData.description}
            onUpdate={(description) =>
              updateItem.mutate({
                itemId: categoryItem.itemData.id,
                data: { description },
              })
            }
          />
        </TableCell>
        {list.showWeights && (
          <TableCell className="py-0.5">
            <div className="no-spin flex">
              <ServerInput
                inline
                type="number"
                min={0}
                selectOnFocus
                className="text-right"
                currentValue={categoryItem.itemData.weight.toLocaleString()}
                onUpdate={(weight) =>
                  updateItem.mutate({
                    itemId: categoryItem.itemData.id,
                    data: { weight: Number(weight) },
                  })
                }
              />
              <Select
                value={categoryItem.itemData.weightUnit}
                onValueChange={(value) =>
                  updateItem.mutate({
                    itemId: categoryItem.itemData.id,
                    data: { weightUnit: value as WeightUnit },
                  })
                }
              >
                <SelectTrigger className="h-auto border-none p-0 px-2 shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(weightUnits).map((unit) => (
                    <SelectItem value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TableCell>
        )}
        <TableCell className="py-0.5">
          <ServerInput
            inline
            type="number"
            min={1}
            selectOnFocus
            currentValue={categoryItem.quantity.toLocaleString()}
            onUpdate={(quantity) =>
              updateCategoryItem.mutate({
                categoryItemId: categoryItem.id,
                categoryId: categoryItem.categoryId,
                data: { quantity: Number(quantity) },
              })
            }
          />
        </TableCell>
        <TableCell className="py-0.5 pl-0">
          <DeleteButton
            handleDelete={() =>
              deleteCategoryItem.mutate({
                categoryItemId: categoryItem.id,
                categoryId: categoryItem.categoryId,
              })
            }
          />
        </TableCell>
        {draggableState.type === "is-dragging-over" &&
        draggableState.closestEdge ? (
          <DropIndicator edge={draggableState.closestEdge} gap={"1px"} />
        ) : null}
      </TableRow>
      {draggableState.type === "preview"
        ? createPortal(
            <ListCategoryItem categoryItem={categoryItem} isOverlay />,
            draggableState.container,
          )
        : null}
    </>
  );
};

export default ListCategoryItem;
