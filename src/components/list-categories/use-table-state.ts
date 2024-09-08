import useCurrentList from "@/hooks/use-current-list";
import type { VisibilityState } from "@tanstack/react-table";
import React from "react";

const defaultColumnVisibility: VisibilityState = {
  packed: false,
  image: false,
  weight: false,
};

export default function useTableState(): { columnVisibility: VisibilityState } {
  const { list } = useCurrentList();

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
