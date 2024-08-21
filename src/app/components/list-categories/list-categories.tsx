import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ItemSelect,
} from "@/api/lib/types";
import React from "react";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DndEntityType, isDndEntityType } from "@/app/lib/constants";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import { z } from "zod";
import { flushSync } from "react-dom";
import useMutations from "@/app/hooks/use-mutations";
import { initCategoryItem } from "@/app/lib/init";
import ListCategory from "./list-category";

type Props = {
  categories: ExpandedCategory[];
};

const ListCategories: React.FC<Props> = (props) => {
  const { categories } = props;
  const { reorderCategories, reorderCategoryItems, addItemToCategory } =
    useMutations();

  React.useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        const entities = [
          DndEntityType.Category,
          DndEntityType.Item,
          DndEntityType.CategoryItem,
        ];
        return entities.some((entity) => isDndEntityType(source.data, entity));
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        // sorting categories
        if (isDndEntityType(source.data, DndEntityType.Category)) {
          const sourceData = z
            .custom<ExpandedCategory>()
            .safeParse(source.data);
          const targetData = z
            .custom<ExpandedCategory>()
            .safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            return;
          }

          const indexOfSource = categories.findIndex(
            (i) => i.id === sourceData.data.id,
          );
          const indexOfTarget = categories.findIndex(
            (i) => i.id === targetData.data.id,
          );

          if (indexOfTarget < 0 || indexOfSource < 0) {
            return;
          }

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          // Using `flushSync` so we can query the DOM straight after this line
          flushSync(() => {
            reorderCategories.mutate(
              reorderWithEdge({
                list: categories,
                startIndex: indexOfSource,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              }),
            );
          });

          const element = document.querySelector(
            `[data-category-id="${sourceData.data.id}"]`,
          );
          if (element instanceof HTMLElement) {
            triggerPostMoveFlash(element);
          }
          return;
        }

        // adding item to empty category
        if (
          isDndEntityType(source.data, DndEntityType.Item) &&
          isDndEntityType(target.data, DndEntityType.CategoryPlaceholder)
        ) {
          const sourceData = z.custom<ItemSelect>().safeParse(source.data);
          const targetData = z
            .object({ id: z.string() })
            .safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            return;
          }

          const targetCategoryId = targetData.data.id;
          const newCategoryItem = initCategoryItem({
            itemData: sourceData.data,
            categoryId: targetCategoryId,
          });

          // Using `flushSync` so we can query the DOM straight after this line
          flushSync(() => {
            addItemToCategory.mutate({
              categoryId: targetCategoryId,
              categoryItems: [newCategoryItem],
              categoryItemId: newCategoryItem.id,
              itemId: sourceData.data.id,
            });
          });

          const element = document.querySelector(
            `[data-category-item-id="${sourceData.data.id}"]`,
          );
          if (element instanceof HTMLElement) {
            triggerPostMoveFlash(element);
          }

          return;
        }

        // adding item
        if (isDndEntityType(source.data, DndEntityType.Item)) {
          const sourceData = z.custom<ItemSelect>().safeParse(source.data);
          const targetData = z
            .custom<ExpandedCategoryItem>()
            .safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            return;
          }

          const targetCategoryId = targetData.data.categoryId;
          const targetCategory = categories.find(
            (i) => i.id === targetCategoryId,
          );
          if (!targetCategory) return;

          const newCategoryItem = initCategoryItem({
            itemData: sourceData.data,
            categoryId: targetCategoryId,
          });

          const items = [...targetCategory.items, newCategoryItem];

          const indexOfSource = items.findIndex(
            (i) => i.id === newCategoryItem.id,
          );
          const indexOfTarget = items.findIndex(
            (i) => i.id === targetData.data.id,
          );

          if (indexOfTarget < 0 || indexOfSource < 0) {
            console.log("could not find indexes");
            return;
          }

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          // Using `flushSync` so we can query the DOM straight after this line
          flushSync(() => {
            addItemToCategory.mutate({
              categoryId: targetCategoryId,
              categoryItems: reorderWithEdge({
                list: items,
                startIndex: indexOfSource,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              }),
              categoryItemId: newCategoryItem.id,
              itemId: sourceData.data.id,
            });
          });

          const element = document.querySelector(
            `[data-category-item-id="${sourceData.data.id}"]`,
          );
          if (element instanceof HTMLElement) {
            triggerPostMoveFlash(element);
          }

          return;
        }

        // sorting items
        if (isDndEntityType(source.data, DndEntityType.CategoryItem)) {
          const sourceData = z
            .custom<ExpandedCategoryItem>()
            .safeParse(source.data);
          const targetData = z
            .custom<ExpandedCategoryItem>()
            .safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            return;
          }

          const targetCategoryId = targetData.data.categoryId;
          const sourceCategoryId = sourceData.data.categoryId;

          const targetCategory = categories.find(
            (i) => i.id === targetCategoryId,
          );
          if (!targetCategory) return;

          const isMovingCategories = targetCategoryId !== sourceCategoryId;
          const items = isMovingCategories
            ? [...targetCategory.items, sourceData.data]
            : targetCategory.items;

          const indexOfSource = items.findIndex(
            (i) => i.id === sourceData.data.id,
          );
          const indexOfTarget = items.findIndex(
            (i) => i.id === targetData.data.id,
          );

          if (indexOfTarget < 0 || indexOfSource < 0) {
            return;
          }

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          // Using `flushSync` so we can query the DOM straight after this line
          flushSync(() => {
            reorderCategoryItems.mutate({
              categoryId: targetCategoryId,
              categoryItems: reorderWithEdge({
                list: items,
                startIndex: indexOfSource,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              }),
            });
          });

          const element = document.querySelector(
            `[data-category-item-id="${targetData.data.id}"]`,
          );
          if (element instanceof HTMLElement) {
            triggerPostMoveFlash(element);
          }
          return;
        }
      },
    });
  }, [categories]);

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <ListCategory key={category.id} category={category} />
      ))}
    </div>
  );
};

export default ListCategories;
