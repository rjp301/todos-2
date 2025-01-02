import React from "react";
import { useQuery } from "@tanstack/react-query";
import PackingItem from "./packing-item";
import { itemsQueryOptions } from "@/lib/queries";
import ArrayQueryGuard from "../base/array-query-guard";
import PackingItemsSortFilter from "../packing-items-sort-filter/component";
import { usePackingItemsSortFilter } from "../packing-items-sort-filter/hook";
import SidebarSectionHeader from "../sidebar/sidebar-section-header";
import useScrollShadow from "@/hooks/use-scroll-shadow";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import useCurrentList from "@/hooks/use-current-list";
import useItemEditorStore from "../item-editor/store";
import { ScrollArea } from "@radix-ui/themes";

const PackingItems: React.FC = () => {
  const itemsQuery = useQuery(itemsQueryOptions);
  const items = usePackingItemsSortFilter(itemsQuery.data ?? []);

  const { openEditor } = useItemEditorStore();

  const { listRef, isScrolled } = useScrollShadow();

  const { listItemIds } = useCurrentList();

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 56,
  });

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex flex-col gap-2 px-4 py-2 transition-shadow",
          isScrolled && "shadow",
        )}
      >
        <SidebarSectionHeader
          title="Gear"
          action={{
            onClick: () => openEditor(),
            children: (
              <>
                <i className="fa-solid fa-plus" />
                <span>Add Gear</span>
              </>
            ),
          }}
          count={items.length}
        />
        <PackingItemsSortFilter />
      </div>
      <ScrollArea
        ref={listRef}
        type="hover"
        className="h-full flex-1 overflow-y-auto overflow-x-hidden"
      >
        <ArrayQueryGuard query={itemsQuery} placeholder="No gear yet">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <PackingItem
                  item={items[virtualItem.index]}
                  isIncludedInList={listItemIds.has(
                    items[virtualItem.index].id,
                  )}
                />
              </div>
            ))}
          </div>
        </ArrayQueryGuard>
      </ScrollArea>
    </div>
  );
};

export default PackingItems;
