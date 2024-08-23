import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import PackingItem from "./packing-item";
import { itemsQueryOptions } from "@/app/lib/queries";
import ArrayQueryGuard from "../base/array-query-guard";
import PackingItemsSortFilter from "./packing-items-sort-filter/component";
import { usePackingItemsSortFilter } from "./packing-items-sort-filter/hook";
import SidebarSectionHeader from "../sidebar/sidebar-section-header";
import useScrollShadow from "@/app/hooks/use-scroll-shadow";
import { cn } from "@/app/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import useCurrentList from "@/app/hooks/use-current-list";
import { useItemEditorStore } from "../item-editor/store";

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
                <Plus size="1rem" className="mr-2" />
                <span>Add Gear</span>
              </>
            ),
          }}
        />
        <PackingItemsSortFilter />
      </div>
      <div
        ref={listRef}
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
                ref={virtualItem.measureElement}
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
      </div>
    </div>
  );
};

export default PackingItems;
