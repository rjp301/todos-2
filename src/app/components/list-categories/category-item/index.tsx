import React from "react";
import type { CategoryItemProps } from "./types";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/app/lib/constants";

import ListCategoryItemMobile from "./list-category-item-mobile";
import ListCategoryItem from "./list-category-item";

const CategoryItem: React.FC<CategoryItemProps> = (props) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (isMobile) {
    return <ListCategoryItemMobile {...props} />;
  }

  return <ListCategoryItem {...props} />;
};

export default CategoryItem;
