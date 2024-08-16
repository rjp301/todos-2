import type { ExpandedCategory } from "@/api/lib/types";
import React from "react";
import Category from "./list-category";

type Props = {
  categories: ExpandedCategory[];
};

const ListCategories: React.FC<Props> = (props) => {
  const { categories } = props;

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <Category category={category} />
      ))}
    </div>
  );
};

export default ListCategories;
