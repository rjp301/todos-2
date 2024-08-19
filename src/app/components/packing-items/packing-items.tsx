import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import PackingItem from "./packing-item";
import { itemsQueryOptions } from "@/app/lib/queries";
import ArrayQueryGuard from "../base/array-query-guard";
import PackingItemsSortFilter from "./packing-items-sort-filter/component";
import { usePackingItemsSortFilter } from "./packing-items-sort-filter/hook";
import SidebarSectionHeader from "../sidebar/sidebar-section-header";

const PackingItems: React.FC = () => {
  const itemsQuery = useQuery(itemsQueryOptions);
  const items = usePackingItemsSortFilter(itemsQuery.data ?? []);

  return (
    <div className="flex h-full flex-1 flex-col gap-2 overflow-hidden p-4">
      <SidebarSectionHeader
        title="Gear"
        action={{
          children: (
            <>
              <Plus size="1rem" className="mr-2" />
              <span>Add List</span>
            </>
          ),
          disabled: true,
        }}
      />
      <PackingItemsSortFilter />
      <Card className="h-full flex-1 overflow-y-auto overflow-x-hidden">
        <ArrayQueryGuard query={itemsQuery} placeholder="No gear yet">
          {items.map((item) => (
            <PackingItem key={item.id} item={item} />
          ))}
        </ArrayQueryGuard>
      </Card>
    </div>
  );
};

export default PackingItems;
