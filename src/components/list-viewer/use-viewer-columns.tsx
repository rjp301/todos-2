import type { ExpandedCategoryItem } from "@/lib/types";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

export default function useViewerColumns() {
  return [
    columnHelper.accessor("itemData.name", {
      header: "Name",
      cell: ({ getValue }) => getValue(),
    }),
  ];
}
