import React from "react";
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
import { Badge } from "../ui/badge";
import { formatWeight } from "@/app/lib/helpers";

interface Props {
  item: ExpandedCategoryItem;
  isDragging?: boolean;
  provided: DraggableProvided;
}

const ListCategoryItemMobile: React.FC<Props> = (props) => {
  const { item, isDragging, provided } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

  const list = queryClient.getQueryData(listQueryOptions(listId).queryKey);

  const { deleteCategoryItem, updateCategoryItem, updateItem } = useMutations();

  if (!list) return null;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={cn(
        "flex items-center gap-1 px-2 py-1 border-b",
        isDragging && "rounded border opacity-30",
      )}
    >
      {list.showPacked && (
        <Checkbox
          className="mr-2"
          checked={item.packed}
          onCheckedChange={(packed) =>
            updateCategoryItem.mutate({
              categoryItemId: item.id,
              data: { packed: Boolean(packed) },
            })
          }
        />
      )}
      <Gripper {...provided.dragHandleProps} />
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
      {list.showWeights && (
        <Badge className="shrink-0 rounded-full" variant="secondary">
          {`${formatWeight(item.itemData.weight)} ${item.itemData.weightUnit}`}
        </Badge>
      )}
      <DeleteButton
        handleDelete={() =>
          deleteCategoryItem.mutate({ categoryItemId: item.id })
        }
      />
    </div>
  );
};

export default ListCategoryItemMobile;
