import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteButton from "@/components/base/delete-button";
import Gripper from "@/components/base/gripper";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import ServerInput from "@/components/input/server-input";
import ListCategoryItem from "./list-category-item";
import { formatWeight, isCategoryFullyPacked } from "@/app/lib/helpers";
import { useDroppable } from "@dnd-kit/core";
import useListId from "@/app/hooks/useListId";
import { listQueryOptions } from "@/app/lib/queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ExpandedCategory } from "@/api/lib/types";
import useMutations from "@/app/hooks/useMutations";

interface Props {
  category: ExpandedCategory;
  isOverlay?: boolean;
}

const ListCategory: React.FC<Props> = (props) => {
  const { category, isOverlay } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

  const list = queryClient.getQueryData(listQueryOptions(listId).queryKey);

  const {
    attributes,
    listeners,
    setNodeRef: sortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
  });

  const { setNodeRef: droppableRef } = useDroppable({
    id: category.id,
    data: { type: "category", data: category },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const {
    deleteCategory,
    toggleCategoryPacked,
    updateCategory,
    addItemToCategory,
  } = useMutations();

  if (!list) return null;

  return (
    <div
      ref={sortableRef}
      style={style}
      className={cn(
        "transition-all",
        isDragging && "opacity-30",
        isOverlay && "rounded border bg-card/70",
      )}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-4 px-1">
              <Gripper {...attributes} {...listeners} isGrabbing={isOverlay} />
            </TableHead>
            {list.showPacked && (
              <TableHead className="w-8">
                <Checkbox
                  checked={isCategoryFullyPacked(category)}
                  onCheckedChange={() =>
                    toggleCategoryPacked.mutate({ categoryId: category.id })
                  }
                />
              </TableHead>
            )}
            <TableHead
              colSpan={2 + (list.showImages ? 1 : 0)}
              className="text-foregound px-1 text-base font-semibold"
            >
              <ServerInput
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
        <TableBody ref={droppableRef}>
          <SortableContext
            id="category-items"
            items={category.items}
            strategy={verticalListSortingStrategy}
          >
            {category.items.map((item) => (
              <ListCategoryItem key={item.id} item={item} />
            ))}
          </SortableContext>
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
    </div>
  );
};

export default ListCategory;
