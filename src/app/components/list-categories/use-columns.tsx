import type { ExpandedCategory, ExpandedCategoryItem } from "@/lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import ServerInput from "../input/server-input";
import useMutations from "@/app/hooks/use-mutations";
import React from "react";
import Gripper from "../base/gripper";
import DeleteButton from "../base/delete-button";
import { Checkbox } from "../ui/checkbox";
import { cn, formatWeight } from "@/app/lib/utils";
import ItemImage from "../item-image";
import AddItemPopover from "./add-item-popover";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

type CellWrapperProps = React.PropsWithChildren<{
  width?: React.CSSProperties["width"];
  center?: boolean;
  className?: string;
}>;

const CellWrapper: React.FC<CellWrapperProps> = (props) => {
  const { children, width, center, className } = props;
  return (
    <span
      className={cn(
        "flex flex-shrink-0 items-center",
        center && "justify-center",
        className,
      )}
      style={{ width }}
    >
      {children}
    </span>
  );
};

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
        header: () => (
          <CellWrapper className="pr-1">
            <Checkbox
              checked={category.packed}
              onCheckedChange={() =>
                toggleCategoryPacked.mutate({ categoryId: category.id })
              }
            />
          </CellWrapper>
        ),
        cell: (props) => (
          <CellWrapper className="pr-1">
            <Checkbox
              checked={props.getValue()}
              onCheckedChange={(packed) =>
                updateCategoryItem.mutate({
                  categoryItemId: props.row.original.id,
                  data: { packed: Boolean(packed) },
                })
              }
            />
          </CellWrapper>
        ),
      }),
      columnHelper.display({
        id: "gripper",
        header: () => <Gripper ref={gripperRef} />,
        meta: { isGripper: true },
      }),

      columnHelper.accessor("itemData.image", {
        id: "image",
        header: () => null,
        cell: (props) => <ItemImage item={props.row.original.itemData} />,
      }),

      columnHelper.accessor(
        (row) => ({
          name: row.itemData.name,
          description: row.itemData.description,
        }),
        {
          id: "name-description",
          header: () => (
            <ServerInput
              inline
              data-focus-id={category.id}
              className="mr-3 py-0.5 text-base font-semibold text-foreground"
              placeholder="Unnamed Category"
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
            <div className="flex-1 @container">
              <div className="grid @lg:grid-cols-[1fr_2fr] @lg:gap-1">
                <ServerInput
                  inline
                  placeholder="Name"
                  currentValue={props.getValue().name}
                  onUpdate={(name) =>
                    updateItem.mutate({
                      itemId: props.row.original.itemData.id,
                      data: { name },
                    })
                  }
                />
                <ServerInput
                  inline
                  placeholder="Description"
                  className="text-muted-foreground"
                  currentValue={props.getValue().description}
                  onUpdate={(description) =>
                    updateItem.mutate({
                      itemId: props.row.original.itemData.id,
                      data: { description },
                    })
                  }
                />
              </div>
            </div>
          ),
          footer: () => (
            <div className="flex-1">
              <AddItemPopover category={category} />
            </div>
          ),
        },
      ),

      columnHelper.accessor("itemData.weight", {
        id: "weight",
        header: () => <CellWrapper width="5rem">Weight</CellWrapper>,
        cell: (props) => (
          <CellWrapper width="5rem">
            {formatWeight(props.getValue())}
          </CellWrapper>
        ),
        footer: () => (
          <CellWrapper width="5rem">
            {formatWeight(category.weight)}
          </CellWrapper>
        ),
      }),
      columnHelper.accessor("quantity", {
        id: "qty",
        header: () => <CellWrapper width={50}>Qty</CellWrapper>,
        cell: (props) => (
          <CellWrapper width={50}>
            <ServerInput
              inline
              type="number"
              placeholder="Qty"
              currentValue={String(props.getValue())}
              onUpdate={(quantity) =>
                updateCategoryItem.mutate({
                  categoryItemId: props.row.original.id,
                  data: { quantity: Number(quantity) },
                })
              }
            />
          </CellWrapper>
        ),
        footer: () => (
          <CellWrapper width={50}>
            {category.items.reduce((acc, val) => acc + val.quantity, 0)}
          </CellWrapper>
        ),
      }),
      columnHelper.display({
        id: "delete",
        header: () => (
          <DeleteButton
            handleDelete={() =>
              deleteCategory.mutate({
                categoryId: category.id,
              })
            }
          />
        ),
        cell: (props) => (
          <DeleteButton
            handleDelete={() =>
              deleteCategoryItem.mutate({
                categoryItemId: props.row.original.id,
              })
            }
          />
        ),
        footer: () => <CellWrapper width="1.5rem" />,
      }),
    ],
    [category, gripperRef],
  );
}
