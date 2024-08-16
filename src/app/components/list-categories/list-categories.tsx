import type { ExpandedCategory } from "@/api/lib/types";
import React from "react";
import Category from "./list-category";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DndEntityType, isDndEntityType } from "@/app/lib/constants";

type Props = {
  categories: ExpandedCategory[];
};

const ListCategories: React.FC<Props> = (props) => {
  const { categories } = props;

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
    });
  }, [categories]);

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <Category category={category} />
      ))}
    </div>
  );
};

export default ListCategories;
