import type { ExpandedCategory, ExpandedCategoryItem } from "@/lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { cn, formatWeight } from "@/lib/utils";
import useViewerStore from "./store";
import CellWrapper from "../base/cell-wrapper";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

export default function useEditorColumns(category: ExpandedCategory) {
  const { togglePackedItem, isItemPacked } = useViewerStore();

  return React.useMemo(
    () => [
      columnHelper.accessor("packed", {
        id: "packed",
        header: () => (
          <CellWrapper className="pr-1">
            <Checkbox
              checked={category.items.every((item) =>
                isItemPacked(category.listId, item.id),
              )}
              onCheckedChange={() =>
                category.items.forEach((item) =>
                  togglePackedItem(category.listId, item.id),
                )
              }
            />
          </CellWrapper>
        ),
        cell: (props) => (
          <CellWrapper className="pr-1">
            <Checkbox
              checked={isItemPacked(category.listId, props.row.original.id)}
              onCheckedChange={() =>
                togglePackedItem(category.listId, props.row.original.id)
              }
            />
          </CellWrapper>
        ),
      }),

      columnHelper.accessor("itemData.image", {
        id: "image",
        header: () => null,
        cell: ({ getValue }) => {
          const imageUrl = getValue();
          return (
            <div
              className={cn(
                "flex w-16 flex-1 items-center justify-center rounded-sm p-0.5",
                imageUrl ? "h-16 bg-white" : "h-full min-h-6 bg-muted/50",
              )}
            >
              {imageUrl && (
                <img
                  className="h-full w-full object-contain"
                  src={imageUrl}
                  alt="thumbnail"
                />
              )}
            </div>
          );
        },
      }),

      columnHelper.accessor(
        (row) => ({
          name: row.itemData.name,
          description: row.itemData.description,
        }),
        {
          id: "name-description",
          header: () => (
            <h2 className="mr-3 py-0.5 text-base font-semibold text-foreground">
              {category.name || "Unnamed Category"}
            </h2>
          ),
          cell: (props) => (
            <div className="flex-1 @container">
              <div className="grid @lg:grid-cols-[1fr_2fr] @lg:gap-1">
                <div>{props.getValue().name}</div>
                <div>{props.getValue().description}</div>
              </div>
            </div>
          ),
        },
      ),

      columnHelper.accessor(
        (row) => ({
          weight: row.itemData.weight,
          weightUnit: row.itemData.weightUnit,
        }),
        {
          id: "weight",
          header: () => <CellWrapper width="7rem">Weight</CellWrapper>,
          cell: (props) => (
            <CellWrapper width="7rem">
              {formatWeight(props.getValue().weight)}
              <span>{props.getValue().weightUnit}</span>
            </CellWrapper>
          ),
          footer: () => (
            <CellWrapper width="7rem" className="px-2">
              {formatWeight(category.weight)}
              {/* <span>{list.weightUnit}</span> */}
            </CellWrapper>
          ),
        },
      ),
      columnHelper.accessor("quantity", {
        id: "qty",
        header: () => <CellWrapper width={50}>Qty</CellWrapper>,
        cell: (props) => (
          <CellWrapper width={50}>{props.getValue()}</CellWrapper>
        ),
        footer: () => (
          <CellWrapper width={50} className="px-2">
            {category.items.reduce((acc, val) => acc + val.quantity, 0)}
          </CellWrapper>
        ),
      }),
    ],
    [category],
  );
}
