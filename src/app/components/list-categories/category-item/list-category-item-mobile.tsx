import React from "react";
import Gripper from "@/app/components/base/gripper";
import { Checkbox } from "@/app/components/ui/checkbox";
import DeleteButton from "@/app/components/base/delete-button";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/app/lib/utils";
import useListId from "@/app/hooks/use-list-id";

import { listQueryOptions } from "@/app/lib/queries";
import useMutations from "@/app/hooks/use-mutations";
import { Badge } from "../../ui/badge";
import { formatWeight } from "@/app/lib/utils";
import QuantityEditor from "../../quantity-editor";
import ItemEditor from "../../item-editor/item-editor";
import ItemImage from "../../item-image";
import type { CategoryItemProps } from "./types";

const ListCategoryItemMobile: React.FC<CategoryItemProps> = (props) => {
  const { item, provided, isDragging } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

  const list = queryClient.getQueryData(listQueryOptions(listId).queryKey);
  const { deleteCategoryItem, updateCategoryItem } = useMutations();

  const [editorOpen, setEditorOpen] = React.useState(false);

  if (!list) return null;

  return (
    <>
      <ItemEditor
        item={item.itemData}
        isOpen={editorOpen}
        setIsOpen={setEditorOpen}
      />
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={cn(
          "flex items-center gap-2 border-b px-2 py-1.5 text-sm",
          "transition-colors hover:bg-muted/20",
          isDragging && "rounded border bg-muted",
        )}
      >
        {list.showPacked && (
          <Checkbox
            className="mr-2"
            checked={item.packed}
            onCheckedChange={(packed) =>
              updateCategoryItem.mutate({
                categoryItemId: item.id,
                categoryId: item.categoryId,
                data: { packed: Boolean(packed) },
              })
            }
          />
        )}
        <Gripper {...provided.dragHandleProps} />
        {list.showImages && <ItemImage item={item.itemData} />}
        <div
          className="flex flex-1 flex-col"
          onClick={() => setEditorOpen(true)}
        >
          <h3
            className={cn(
              "truncate font-medium",
              !item.itemData.name && "italic text-muted-foreground",
            )}
          >
            {item.itemData.name || "Unnamed Item"}
          </h3>
          {item.itemData.description && (
            <p className="text-muted-foreground">{item.itemData.description}</p>
          )}
        </div>

        <QuantityEditor
          quantity={item.quantity}
          setQuantity={(quantity) =>
            updateCategoryItem.mutate({
              categoryItemId: item.id,
              categoryId: item.categoryId,
              data: { quantity: Number(quantity) },
            })
          }
        />
        {list.showWeights && (
          <Badge
            className="shrink-0 rounded-full"
            variant="secondary"
            onClick={() => setEditorOpen(true)}
          >
            {`${formatWeight(item.itemData.weight)} ${item.itemData.weightUnit}`}
          </Badge>
        )}
        <DeleteButton
          handleDelete={() =>
            deleteCategoryItem.mutate({
              categoryItemId: item.id,
              categoryId: item.categoryId,
            })
          }
        />
      </div>
    </>
  );
};

export default ListCategoryItemMobile;
