import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import Gripper from "@/components/base/gripper";
import { Checkbox } from "@/components/ui/checkbox";
import ServerInput from "@/components/input/server-input";
import DeleteButton from "@/components/base/delete-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import ItemImage from "@/components/item-image";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useListId from "@/app/hooks/useListId";

import { listQueryOptions } from "@/app/lib/queries";
import { api } from "@/lib/client";
import type { ExpandedCategoryItem } from "@/api/lib/types";
import type { CategoryItem, Item } from "astro:db";
import { weightUnits, type WeightUnit } from "@/api/lib/weight-units";
import useMutations from "@/app/hooks/useMutations";

interface Props {
  item: ExpandedCategoryItem;
  isOverlay?: boolean;
}

const ListCategoryItem: React.FC<Props> = (props) => {
  const { item, isOverlay } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

  const list = queryClient.getQueryData(listQueryOptions(listId).queryKey);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: item.id,
    });
  const style = { transform: CSS.Translate.toString(transform) };

  const { deleteCategoryItem } = useMutations();

  const updateItemMutation = useMutation({
    mutationFn: (data: Partial<typeof Item.$inferInsert>) =>
      api.items.update.$post({ json: { id: item.itemData.id, value: data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listQueryOptions(listId).queryKey,
      });
    },
  });

  const updateCategoryItemMutation = useMutation({
    mutationFn: (data: Partial<typeof CategoryItem.$inferInsert>) =>
      api["categories-items"].update.$post({
        json: { id: item.id, value: data },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listQueryOptions(listId).queryKey,
      });
    },
  });

  if (!list) return null;

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded",
        isOverlay && "rounded border",
        isDragging && "opacity-30",
      )}
    >
      <TableCell className="w-4 px-1 py-0.5">
        <Gripper {...attributes} {...listeners} />
      </TableCell>
      {list.showPacked && (
        <TableCell className="py-0">
          <Checkbox
            checked={item.packed}
            onCheckedChange={(packed) =>
              updateCategoryItemMutation.mutate({ packed: Boolean(packed) })
            }
          />
        </TableCell>
      )}
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
          onUpdate={(name) => updateItemMutation.mutate({ name })}
        />
      </TableCell>
      <TableCell className="w-1/2 px-1 py-0.5 text-muted-foreground">
        <ServerInput
          placeholder="Description"
          currentValue={item.itemData.description}
          onUpdate={(description) => updateItemMutation.mutate({ description })}
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
                updateItemMutation.mutate({ weight: Number(weight) })
              }
            />
            <Select
              value={item.itemData.weightUnit}
              onValueChange={(value) =>
                updateItemMutation.mutate({ weightUnit: value as WeightUnit })
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
            updateCategoryItemMutation.mutate({ quantity: Number(quantity) })
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
