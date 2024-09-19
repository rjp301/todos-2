import type { ExpandedCategory, ExpandedCategoryItem } from "@/lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import ServerInput from "../input/server-input";
import useMutations from "@/hooks/use-mutations";
import React from "react";
import Gripper from "../base/gripper";
import DeleteButton from "../base/delete-button";
import { Checkbox } from "../ui/checkbox";
import { formatWeight, getCheckboxState } from "@/lib/utils";
import ItemImageDialog from "../item-image-dialog";
import AddItemPopover from "./add-item-popover";
import { weightUnits } from "@/lib/weight-units";
import useCurrentList from "@/hooks/use-current-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CellWrapper from "../base/cell-wrapper";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

type UseColumnsProps = {
  category: ExpandedCategory;
  gripperRef: React.RefObject<HTMLButtonElement>;
  addItemRef: React.RefObject<HTMLButtonElement>;
};

export default function useEditorColumns({
  category,
  gripperRef,
  addItemRef,
}: UseColumnsProps) {
  const {
    updateCategory,
    deleteCategory,
    deleteCategoryItem,
    toggleCategoryPacked,
    updateCategoryItem,
    updateItem,
  } = useMutations();

  const { list } = useCurrentList();

  if (!list) return [];

  return React.useMemo(
    () => [
      columnHelper.accessor("packed", {
        id: "packed",
        header: () => (
          <CellWrapper className="pr-1">
            <Checkbox
              checked={getCheckboxState(category.items.map((i) => i.packed))}
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
        cell: (props) => <ItemImageDialog item={props.row.original.itemData} />,
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
              <AddItemPopover ref={addItemRef} category={category} />
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
              <ServerInput
                inline
                type="number"
                currentValue={String(props.getValue().weight)}
                min={0}
                selectOnFocus
                onUpdate={(weight) =>
                  updateItem.mutate({
                    itemId: props.row.original.itemId,
                    data: { weight: Number(weight) },
                  })
                }
              />
              <Select
                value={props.getValue().weightUnit}
                onValueChange={(weightUnit) =>
                  updateItem.mutate({
                    itemId: props.row.original.itemId,
                    data: { weightUnit },
                  })
                }
              >
                <SelectTrigger className="h-auto max-w-11 truncate border-none px-1 py-1 shadow-none transition-colors placeholder:italic hover:bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(weightUnits).map((unit) => (
                    <SelectItem value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CellWrapper>
          ),
          footer: () => (
            <CellWrapper width="7rem" className="px-2">
              {formatWeight(category.weight)}
              <span>{list.weightUnit}</span>
            </CellWrapper>
          ),
        },
      ),
      columnHelper.accessor("quantity", {
        id: "qty",
        header: () => <CellWrapper width={50}>Qty</CellWrapper>,
        cell: (props) => (
          <CellWrapper width={50}>
            <ServerInput
              inline
              type="number"
              placeholder="Qty"
              selectOnFocus
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
          <CellWrapper width={50} className="px-2">
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
    [category, gripperRef, list.weightUnit],
  );
}
