import type { ListSelect } from "@/lib/types";
import type { VisibilityState } from "@tanstack/react-table";
import React from "react";

const defaultColumnVisibility: VisibilityState = {
  packed: false,
  image: false,
  weight: false,
};

export default function useListTableState(list: ListSelect | undefined): {
  columnVisibility: VisibilityState;
} {
  const columnVisibility: VisibilityState = React.useMemo(
    () =>
      list
        ? {
            packed: list.showPacked,
            image: list.showImages,
            weight: list.showWeights,
          }
        : defaultColumnVisibility,
    [list],
  );

  return { columnVisibility };
}
