import {
  weightUnits,
  type ExpandedCategory,
  type ExpandedCategoryItem,
} from "@/lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import ServerInput from "../input/server-input";
import useMutations from "@/hooks/use-mutations";
import React from "react";
import Gripper from "../base/gripper";
import DeleteButton from "../base/delete-button";
import { cn, formatWeight, getCheckboxState } from "@/lib/utils";
import ItemImageDialog from "../item-image-dialog";
import AddItemPopover from "./add-item-popover";
import useCurrentList from "@/hooks/use-current-list";
import CellWrapper from "../base/cell-wrapper";
import { WeightConvertible } from "@/lib/convertible";
import { TextField, Select, Checkbox } from "@radix-ui/themes";

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
              size="3"
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
              size="3"
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
          isPacked: row.packed,
        }),
        {
          id: "name-description",
          header: () => (
            <ServerInput
              size="3"
              data-focus-id={category.id}
              className="text-base font-semibold text-foreground mr-3 py-0.5"
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
            <div
              className={cn(
                "flex-1 @container",
                list.showPacked &&
                  props.getValue().isPacked &&
                  "line-through opacity-50",
              )}
            >
              <div className="grid @lg:grid-cols-[1fr_2fr] @lg:gap-1">
                <ServerInput
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
          header: () => <CellWrapper width="5rem">Weight</CellWrapper>,
          cell: (props) => (
            <CellWrapper width="5rem">
              <ServerInput
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
              >
                <TextField.Slot side="right">
                  <Select.Root
                    size="1"
                    value={props.getValue().weightUnit}
                    onValueChange={(weightUnit) =>
                      updateItem.mutate({
                        itemId: props.row.original.itemId,
                        data: { weightUnit },
                      })
                    }
                  >
                    <Select.Trigger variant="ghost" />
                    <Select.Content>
                      {Object.values(weightUnits).map(({ symbol }) => (
                        <Select.Item value={symbol}>{symbol}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </TextField.Slot>
              </ServerInput>
            </CellWrapper>
          ),
          footer: () => {
            const totalWeight = category.items.reduce(
              (acc, val) =>
                acc +
                WeightConvertible.convert(
                  val.itemData.weight,
                  val.itemData.weightUnit,
                  list.weightUnit,
                ),
              0,
            );
            return (
              <CellWrapper width="7rem" className="px-2">
                {formatWeight(totalWeight)}
                <span>{list.weightUnit}</span>
              </CellWrapper>
            );
          },
        },
      ),
      columnHelper.accessor("quantity", {
        id: "qty",
        header: () => <CellWrapper width={50}>Qty</CellWrapper>,
        cell: (props) => (
          <CellWrapper width={50}>
            <ServerInput
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
            noConfirm
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
    [category, gripperRef, list],
  );
}
