import React from "react";
import { TableCell, TableRow } from "@/app/components/ui/table";
import Gripper from "@/app/components/base/gripper";
import { Checkbox } from "@/app/components/ui/checkbox";
import ServerInput from "@/app/components/input/server-input";
import DeleteButton from "@/app/components/base/delete-button";
import { useQueryClient } from "@tanstack/react-query";
// import ItemImage from "@/app/components/item-image";
import { cn } from "@/app/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import useListId from "@/app/hooks/useListId";

import { listQueryOptions } from "@/app/lib/queries";
import type { ExpandedCategoryItem } from "@/api/lib/types";
import { weightUnits, type WeightUnit } from "@/api/helpers/weight-units";
import useMutations from "@/app/hooks/useMutations";
import type { DraggableProvided } from "react-beautiful-dnd";

interface Props {
  item: ExpandedCategoryItem;
  isDragging?: boolean;
  provided: DraggableProvided;
}

const ListCategoryItem: React.FC<Props> = (props) => {
  const { item, isDragging, provided } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

  const list = queryClient.getQueryData(listQueryOptions(listId).queryKey);

  const { deleteCategoryItem, updateCategoryItem, updateItem } = useMutations();

  if (!list) return null;

  return (
    <TableRow
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={cn("rounded", isDragging && "rounded border opacity-30")}
    >
      {list.showPacked && (
        <TableCell className="py-0">
          <Checkbox
            checked={item.packed}
            onCheckedChange={(packed) =>
              updateCategoryItem.mutate({
                categoryItemId: item.id,
                data: { packed: Boolean(packed) },
              })
            }
          />
        </TableCell>
      )}
      <TableCell className="w-4 px-1 py-0.5">
        <Gripper {...provided.dragHandleProps} />
      </TableCell>
      {list.showImages && (
        <TableCell>
          <div className={cn(!item.itemData.image && "absolute inset-2")}>
            {/* <ItemImage item={item.itemData} /> */}
            image
          </div>
        </TableCell>
      )}
      <TableCell className="px-1 py-0.5">
        <ServerInput
          placeholder="Name"
          currentValue={item.itemData.name}
          onUpdate={(name) =>
            updateItem.mutate({
              itemId: item.itemData.id,
              data: { name },
            })
          }
        />
      </TableCell>
      <TableCell className="w-1/2 px-1 py-0.5 text-muted-foreground">
        <ServerInput
          placeholder="Description"
          currentValue={item.itemData.description}
          onUpdate={(description) =>
            updateItem.mutate({
              itemId: item.itemData.id,
              data: { description },
            })
          }
        />
      </TableCell>
      {list.showWeights && (
        <TableCell className="py-0.5">
          <div className="no-spin flex">
            <ServerInput
              type="number"
              min={0}
              selectOnFocus
              className="text-right"
              currentValue={item.itemData.weight.toLocaleString()}
              onUpdate={(weight) =>
                updateItem.mutate({
                  itemId: item.itemData.id,
                  data: { weight: Number(weight) },
                })
              }
            />
            <Select
              value={item.itemData.weightUnit}
              onValueChange={(value) =>
                updateItem.mutate({
                  itemId: item.itemData.id,
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
          type="number"
          min={1}
          selectOnFocus
          currentValue={item.quantity.toLocaleString()}
          onUpdate={(quantity) =>
            updateCategoryItem.mutate({
              categoryItemId: item.id,
              data: { quantity: Number(quantity) },
            })
          }
        />
      </TableCell>
      <TableCell className="py-0.5 pl-0">
        <DeleteButton
          handleDelete={() =>
            deleteCategoryItem.mutate({ categoryItemId: item.id })
          }
        />
      </TableCell>
    </TableRow>
  );
};

export default ListCategoryItem;
