import type { ExpandedCategory, ExpandedCategoryItem } from "@/api/lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import ServerInput from "../input/server-input";
import useMutations from "@/app/hooks/use-mutations";
import React from "react";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

export default function useColumns(category: ExpandedCategory) {
  const { updateCategory } = useMutations();
  return React.useMemo(
    () => [
      columnHelper.group({
        id: "main-info",
        header: () => (
          <ServerInput
            inline
            className="py-0.5 text-base"
            placeholder="Category Name"
            currentValue={category.name ?? ""}
            onUpdate={(value) =>
              updateCategory.mutate({
                categoryId: category.id,
                data: { name: value },
              })
            }
          />
        ),
      }),
      columnHelper.accessor("itemData.weight", {
        id: "weight",
      }),
    ],
    [category],
  );
}
