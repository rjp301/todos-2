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

const PackingItems: React.FC = () => {
  const itemsQuery = useQuery(itemsQueryOptions);
  const items = usePackingItemsSortFilter(itemsQuery.data ?? []);

  const { listRef, isScrolled } = useScrollShadow();

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
            children: (
              <>
                <Plus size="1rem" className="mr-2" />
                <span>Add Gear</span>
              </>
            ),
            disabled: true,
          }}
        />
        <PackingItemsSortFilter />
      </div>
      <div
        ref={listRef}
        className="h-full flex-1 overflow-y-auto overflow-x-hidden"
      >
        <ArrayQueryGuard query={itemsQuery} placeholder="No gear yet">
          {items.map((item) => (
            <PackingItem key={item.id} item={item} />
          ))}
        </ArrayQueryGuard>
      </div>
    </div>
  );
};

export default PackingItems;
