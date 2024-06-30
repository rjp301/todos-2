import type { ExpandedCategory } from "@/api/lib/types";
import React from "react";
import ListCategory from "./list-category";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type OnDragEndResponder,
  type OnDragStartResponder,
} from "react-beautiful-dnd";
import useMutations from "@/app/hooks/useMutations";

type Props = {
  categories: ExpandedCategory[];
};

const ListCategories: React.FC<Props> = (props) => {
  const { categories } = props;
  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  const { reorderCategories } = useMutations();

  const handleDragStart: OnDragStartResponder = (result) => {
    const { draggableId } = result;
    setDraggingId(draggableId);
  };

  const handleDragEnd: OnDragEndResponder = (result) => {
    const { destination, source, draggableId } = result;
    const currentItem = categories.find((item) => item.id === draggableId);

    setDraggingId(null);
    if (!destination || !currentItem) return;

    const newItems = Array.from(categories);
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, currentItem);

    reorderCategories.mutate(newItems);
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
                  <ListCategory
                    category={category}
                    provided={provided}
                    isDragging={category.id === draggingId}
                  />
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
