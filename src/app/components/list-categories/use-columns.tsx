import type { ExpandedCategory, ExpandedCategoryItem } from "@/api/lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import ServerInput from "../input/server-input";
import useMutations from "@/app/hooks/use-mutations";
import React from "react";
import Gripper from "../base/gripper";
import DeleteButton from "../base/delete-button";
import { Checkbox } from "../ui/checkbox";
import { formatWeight } from "@/app/lib/utils";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

export default function useColumns(
  category: ExpandedCategory,
  gripperRef: React.RefObject<HTMLButtonElement>,
) {
  const {
    updateCategory,
    deleteCategory,
    deleteCategoryItem,
    toggleCategoryPacked,
    updateCategoryItem,
    updateItem,
  } = useMutations();

  return React.useMemo(
    () => [
      columnHelper.accessor("packed", {
        id: "packed",
        size: 0,
        maxSize: 16,
        header: () => (
          <Checkbox
            checked={category.packed}
            onCheckedChange={() =>
              toggleCategoryPacked.mutate({ categoryId: category.id })
            }
          />
        ),
        cell: (props) => (
          <Checkbox
            checked={props.getValue()}
            onCheckedChange={(packed) =>
              updateCategoryItem.mutate({
                categoryItemId: props.row.original.id,
                categoryId: props.row.original.categoryId,
                data: { packed: Boolean(packed) },
              })
            }
          />
        ),
      }),
      columnHelper.display({
        id: "gripper",
        size: 0,
        maxSize: 12,
        header: () => <Gripper reference={gripperRef} />,
        cell: () => <Gripper />,
      }),

      columnHelper.accessor("itemData.name", {
        id: "name",
        header: () => (
          <ServerInput
            inline
            className="py-0.5 text-base font-semibold text-foreground"
            placeholder="Category Name"
            currentValue={category.name ?? ""}
            onUpdate={(value) =>
              updateCategory.mutate({
                categoryId: category.id,
                data: { name: value },
              })
            }
          />
        ),
        cell: (props) => (
          <ServerInput
            inline
            placeholder="Name"
            currentValue={props.getValue()}
            onUpdate={(name) =>
              updateItem.mutate({
                itemId: props.row.original.itemData.id,
                data: { name },
              })
            }
          />
        ),
      }),
      columnHelper.accessor("itemData.description", {
        id: "description",
        header: () => null,
        cell: (props) => (
          <ServerInput
            inline
            placeholder="Name"
            className="text-muted-foreground"
            currentValue={props.getValue()}
            onUpdate={(description) =>
              updateItem.mutate({
                itemId: props.row.original.itemData.id,
                data: { description },
              })
            }
          />
        ),
      }),
      columnHelper.accessor("itemData.weight", {
        id: "weight",
        size: 48,
        header: "Weight",
        footer: () => formatWeight(category.weight),
      }),
      columnHelper.accessor("quantity", {
        id: "qty",
        size: 48,
        header: "Qty",
        footer: () =>
          category.items.reduce((acc, val) => acc + val.quantity, 0),
      }),
      columnHelper.display({
        id: "delete",
        size: 0,
        maxSize: 24,
        header: () => (
          <DeleteButton
            handleDelete={() =>
              deleteCategory.mutate({
                categoryId: category.id,
                categoryName: category.name,
              })
            }
          />
        ),
        cell: (props) => (
          <DeleteButton
            handleDelete={() =>
              deleteCategoryItem.mutate({
                categoryItemId: props.row.original.id,
                categoryId: category.id,
              })
            }
          />
        ),
      }),
    ],
    [category, gripperRef],
  );
}
