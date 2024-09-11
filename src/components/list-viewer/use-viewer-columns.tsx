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
  const { listId } = category;

  return React.useMemo(
    () => [
      columnHelper.accessor("packed", {
        id: "packed",
        header: () => (
          <CellWrapper center>
            <Checkbox
              checked={category.items.every((item) =>
                isItemPacked({ listId, itemId: item.id }),
              )}
              onCheckedChange={(checked) =>
                category.items.forEach((item) =>
                  togglePackedItem({
                    packed: Boolean(checked),
                    listId,
                    itemId: item.id,
                  }),
                )
              }
            />
          </CellWrapper>
        ),
        cell: (props) => (
          <CellWrapper center>
            <Checkbox
              checked={isItemPacked({ listId, itemId: props.row.original.id })}
              onCheckedChange={(checked) =>
                togglePackedItem({
                  packed: Boolean(checked),
                  listId,
                  itemId: props.row.original.id,
                })
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
                "flex w-16 items-center justify-center rounded-sm p-0.5",
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
            <h2 className="flex-1 py-0.5 text-lg font-semibold text-foreground">
              {category.name || "Unnamed Category"}
            </h2>
          ),
          cell: (props) => (
            <div className="flex-1 @container">
              <div className="grid @lg:grid-cols-[1fr_2fr] @lg:gap-1">
                <div>{props.getValue().name}</div>
                <div className="text-muted-foreground">
                  {props.getValue().description}
                </div>
              </div>
            </div>
          ),
          footer: () => <div className="flex-1" />,
        },
      ),

      columnHelper.accessor(
        (row) => ({
          weight: row.itemData.weight,
          weightUnit: row.itemData.weightUnit,
        }),
        {
          id: "weight",
          header: () => (
            <CellWrapper center width="7rem">
              Weight
            </CellWrapper>
          ),
          cell: (props) => (
            <CellWrapper center width="7rem">
              {formatWeight(props.getValue().weight)}
              <span>{props.getValue().weightUnit}</span>
            </CellWrapper>
          ),
          footer: () => (
            <CellWrapper center width="7rem">
              {formatWeight(category.weight)}
              {/* <span>{list.weightUnit}</span> */}
            </CellWrapper>
          ),
        },
      ),
      columnHelper.accessor("quantity", {
        id: "qty",
        header: () => (
          <CellWrapper center width={50}>
            Qty
          </CellWrapper>
        ),
        cell: (props) => (
          <CellWrapper center width={50}>
            {props.getValue()}
          </CellWrapper>
        ),
        footer: () => (
          <CellWrapper center width={50}>
            {category.items.reduce((acc, val) => acc + val.quantity, 0)}
          </CellWrapper>
        ),
      }),
    ],
    [category],
  );
}
