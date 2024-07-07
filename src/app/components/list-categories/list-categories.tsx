import type { ExpandedCategory } from "@/api/lib/types";
import React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type OnDragEndResponder,
  type OnDragStartResponder,
} from "@hello-pangea/dnd";
import useMutations from "@/app/hooks/use-mutations";
import { useDraggingStore } from "./dragging-store";
import Category from "./category";

type Props = {
  categories: ExpandedCategory[];
};

const ListCategories: React.FC<Props> = (props) => {
  const { categories } = props;

  const { reorderCategories } = useMutations();

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

    if (type === "category") {
      const active = categories.find((item) => item.id === draggableId);
      if (!active) return;

      const newItems = Array.from(categories);
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, active);

      reorderCategories.mutate(newItems);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Droppable droppableId="list-categories" type="category">
        {(provided) => (
          <div
            ref={provided.innerRef}
            className="flex flex-col gap-4"
            {...provided.droppableProps}
          >
            {categories.map((category, index) => (
              <Draggable
                key={category.id}
                draggableId={category.id}
                index={index}
              >
                {(provided) => (
                  <Category category={category} provided={provided} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListCategories;
