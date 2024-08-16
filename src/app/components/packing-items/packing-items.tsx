import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowDownWideNarrow, Plus } from "lucide-react";
import PackingItem from "./packing-item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { itemsQueryOptions } from "@/app/lib/queries";
import useSortFilterItems from "./use-sort-filter-items";
import ArrayQueryGuard from "../base/array-query-guard";

const PackingItems: React.FC = () => {
  const itemsQuery = useQuery(itemsQueryOptions);

  const {
    itemsSorted,
    filterQuery,
    sortOptions,
    sortOption,
    handleFilterChange,
    handleSortChange,
  } = useSortFilterItems(itemsQuery.data || []);

  return (
    <div className="flex h-full flex-1 flex-col gap-2 overflow-hidden p-4">
      <header className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <span className="text-base font-semibold">Gear</span>
          <Button size="sm" variant="linkMuted" disabled>
            <Plus size="1rem" className="mr-2" />
            Add Gear
          </Button>
        </div>
        <div className="flex gap-1">
          <Input
            placeholder="Filter..."
            className="bg-card"
            value={filterQuery}
            onChange={handleFilterChange}
          />
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ArrowDownWideNarrow size="1rem" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Sort Gear</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort Gear</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={handleSortChange}
              >
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    {option}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Card className="h-full flex-1 overflow-y-auto overflow-x-hidden">
        <ArrayQueryGuard query={itemsQuery} placeholder="No gear yet">
          {itemsSorted.map((item) => (
            <PackingItem key={item.id} item={item} />
          ))}
        </ArrayQueryGuard>
      </Card>
    </div>
  );
};

export default PackingItems;
