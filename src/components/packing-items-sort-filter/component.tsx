import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ArrowDownWideNarrow, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePackingItemsSortFilterStore } from "./store";
import { FilterOptions, SortOptions } from "./types";

const PackingItemsSortFilter: React.FC = () => {
  const store = usePackingItemsSortFilterStore();

  return (
    <div className="flex items-center gap-1">
      <Input
        type="search"
        placeholder="Search..."
        className="mr-1 h-8 bg-card"
        value={store.searchQuery}
        onChange={(e) => store.setSearchQuery(e.target.value)}
      />
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowDownWideNarrow size="1rem" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Sort</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort Gear</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={store.sortOption}
            onValueChange={(value) => {
              store.setSortOption(value as SortOptions);
            }}
          >
            {Object.values(SortOptions).map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Filter size="1rem" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Filter</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter Gear</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={store.filterOptions[FilterOptions.NotInList]}
            onCheckedChange={() =>
              store.toggleFilterOption(FilterOptions.NotInList)
            }
          >
            Hide items in current list
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PackingItemsSortFilter;
