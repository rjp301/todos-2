import type { ExpandedCategoryItem } from "@/lib/types";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

const columns = [
  columnHelper.accessor("itemData.name", {
    header: "Name",
    cell: ({ getValue }) => getValue(),
  }),
];

export default columns;
