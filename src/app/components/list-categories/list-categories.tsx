import type { ExpandedCategory } from "@/api/lib/types";
import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Category from "./category";

type Props = {
  categories: ExpandedCategory[];
};

const ListCategories: React.FC<Props> = (props) => {
  const { categories } = props;

  return (
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
  );
};

export default ListCategories;
