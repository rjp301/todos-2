import React from "react";

import { cn } from "@/lib/utils";
import type { ExpandedCategory, ListSelect } from "@/lib/types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useListTableState from "../../hooks/use-list-table-state";
import useViewerColumns from "./use-viewer-columns";
import Placeholder from "../base/placeholder";
import { Separator } from "../ui/separator";

interface Props {
  category: ExpandedCategory;
  list: ListSelect;
}

const ViewerCategory: React.FC<Props> = (props) => {
  const { category, list } = props;

  const ref = React.useRef<HTMLDivElement>(null);

  const columns = useViewerColumns(category);

  const { columnVisibility } = useListTableState(list);
  columnVisibility.packed = true;

  const table = useReactTable({
    data: category.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  });

  return (
    <div
      ref={ref}
      key={category.id}
      data-category-id={category.id}
      className={cn("relative flex w-full flex-col")}
    >
      <header className="w-full border-b text-sm font-semibold text-muted-foreground">
        {table.getHeaderGroups().map((headerGroup) => (
          <div
            className="flex h-10 min-h-12 w-full items-center gap-3 px-3 text-sm transition-colors hover:bg-muted/50"
            key={headerGroup.id}
          >
            {headerGroup.headers.map((header) => (
              <React.Fragment key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </header>
      <section>
        {table.getRowModel().rows.map((row) => (
          <React.Fragment key={row.id}>
            <div
              ref={ref}
              data-category-item-id={row.original.id}
              className={cn(
                "relative flex h-fit min-h-10 items-center gap-3 px-3 py-1 text-sm transition-colors hover:bg-muted/50",
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <React.Fragment key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </React.Fragment>
              ))}
            </div>
            <Separator />
          </React.Fragment>
        ))}

        {table.getRowCount() === 0 && (
          <Placeholder message="No items in this category" />
        )}
      </section>
      <footer>
        {table.getFooterGroups().map((footerGroup) => (
          <div
            key={footerGroup.id}
            className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            {footerGroup.headers.map((header) => (
              <React.Fragment key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </footer>
    </div>
  );
};

export default ViewerCategory;
