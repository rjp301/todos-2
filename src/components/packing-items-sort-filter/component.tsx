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
import { FilterOptions, SortOptions } from "./types";
import { useAtom } from "jotai";
import { filterOptionsAtom, searchStringAtom, sortOptionAtom } from "./store";

const PackingItemsSortFilter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchStringAtom);
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  const [filterOptions, setFilterOptions] = useAtom(filterOptionsAtom);

  return (
    <div className="flex items-center gap-1">
      <Input
        type="search"
        placeholder="Search..."
        className="mr-1 h-8 bg-card"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
            value={sortOption}
            onValueChange={(value) => {
              setSortOption(value as SortOptions);
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
            checked={filterOptions[FilterOptions.NotInList]}
            onCheckedChange={() =>
              setFilterOptions((prev) => ({
                ...prev,
                [FilterOptions.NotInList]: !prev[FilterOptions.NotInList],
              }))
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
