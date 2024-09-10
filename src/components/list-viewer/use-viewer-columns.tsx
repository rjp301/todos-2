import type { ExpandedCategoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

export default function useViewerColumns() {
  return [
    columnHelper.accessor("itemData.image", {
      header: "Image",
      cell: ({ getValue }) => {
        const imageUrl = getValue();
        return (
          <div
            className={cn(
              "flex w-16 flex-1 items-center justify-center rounded-sm p-0.5",
              imageUrl ? "h-16 bg-white" : "h-full min-h-6 bg-muted/50",
            )}
          >
            {imageUrl && (
              <img
                className="h-full w-full object-contain"
                src={imageUrl}
                alt="thumbnail"
              />
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("itemData.name", {
      header: "Name",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("itemData.description", {
      header: "Description",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("quantity", {
      header: "Qty",
      cell: ({ getValue }) => getValue(),
    }),
  ];
}
