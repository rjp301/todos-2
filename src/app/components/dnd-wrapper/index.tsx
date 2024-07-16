import React from "react";
import { moveInArray } from "@/app/lib/helpers/move-in-array";
import useMutations from "@/app/hooks/use-mutations";
import { useDraggingStore } from "./dnd-store";
import {
  DragDropContext,
  type OnDragEndResponder,
  type OnDragStartResponder,
} from "@hello-pangea/dnd";
import useListId from "@/app/hooks/use-list-id";
import { useQuery } from "@tanstack/react-query";
import { listQueryOptions } from "@/app/lib/queries";

type Props = React.PropsWithChildren;

const DndWrapper: React.FC<Props> = ({ children }) => {
  const listId = useListId();
  const listQuery = useQuery(listQueryOptions(listId));
  const categories = listQuery.data?.categories ?? [];

  const { reorderCategories, updateCategoryItem, reorderCategoryItems } =
    useMutations();

  const { resetDragging, setDraggingCategory, setDraggingCategoryItem } =
    useDraggingStore();

  const handleDragStart: OnDragStartResponder = (result) => {
    const { draggableId, type } = result;

    if (type === "category") {
      resetDragging();
      setDraggingCategory(draggableId);
    }

    if (type === "category-item") {
      resetDragging();
      setDraggingCategoryItem(draggableId);
    }
  };

  const handleDragEnd: OnDragEndResponder = (result) => {
    const { destination, source, draggableId, type } = result;
    resetDragging();

    if (!destination) return;

    if (type === "category-item") {
      console.log("category-item");
      console.log(draggableId);

      if (source.droppableId !== destination.droppableId) {
        updateCategoryItem.mutate({
          categoryId: source.droppableId,
          categoryItemId: draggableId,
          data: {
            categoryId: destination.droppableId,
          },
        });
        return;
      }

      const currentCategoryItems =
        categories.find((i) => i.id === source.droppableId)?.items ?? [];
      const newCategoryItems = moveInArray(
        currentCategoryItems,
        source.index,
        destination.index,
      );
      reorderCategoryItems.mutate({
        categoryId: source.droppableId,
        categoryItems: newCategoryItems,
      });

      return;
    }

    if (type === "category") {
      const newItems = moveInArray(categories, source.index, destination.index);
      reorderCategories.mutate(newItems);
      return;
    }
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {children}
    </DragDropContext>
  );
};

export default DndWrapper;
