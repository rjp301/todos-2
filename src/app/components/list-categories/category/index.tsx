import React from "react";
import type { CategoryProps } from "./types";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/app/lib/constants";

import ListCategoryMobile from "./list-category-mobile";
import ListCategory from "./list-category";

const Category: React.FC<CategoryProps> = (props) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (isMobile) {
    return <ListCategoryMobile {...props} />;
  }

  return <ListCategory {...props} />;
};

export default Category;
