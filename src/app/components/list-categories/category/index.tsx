import React from "react";
import type { CategoryProps } from "./types";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/app/lib/constants";

import ListCategoryMobile from "./list-category-mobile";
import ListCategory from "./list-category";
import { useDraggingStore } from "../dragging-store";

const Category: React.FC<CategoryProps> = (props) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const isDragging = useDraggingStore(
    (state) => state.draggingCategoryId === props.category.id,
  );

  if (isMobile) {
    return <ListCategoryMobile {...props} isDragging={isDragging} />;
  }

  return <ListCategory {...props} isDragging={isDragging} />;
};

export default Category;
