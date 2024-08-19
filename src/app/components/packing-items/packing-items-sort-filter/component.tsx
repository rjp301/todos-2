import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

import { ArrowDownWideNarrow, Filter } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import type { FilteringFn, SortingFn } from "./types";
import type { ItemSelect } from "@/api/lib/types";

enum SortOptions {
  CreatedAt = "Created At",
  Name = "Name",
  Description = "Description",
  Weight = "Weight",
}
const SortFunctions: Record<SortOptions, SortingFn> = {
  [SortOptions.CreatedAt]: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  [SortOptions.Name]: (a, b) => a.name.localeCompare(b.name),
  [SortOptions.Description]: (a, b) =>
    a.description.localeCompare(b.description),
  [SortOptions.Weight]: (a, b) => a.weight - b.weight,
};

const filterSearchTerm = (item: ItemSelect, query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return (
    item.name.toLowerCase().includes(lowerCaseQuery) ||
    item.description.toLowerCase().includes(lowerCaseQuery)
  );
};

type Props = {
  setFilteringFn: React.Dispatch<React.SetStateAction<FilteringFn>>;
  setSortingFn: React.Dispatch<React.SetStateAction<SortingFn>>;
};

const PackingItemsSortFilter: React.FC<Props> = (props) => {
  const { setFilteringFn, setSortingFn } = props;

  const [sortOption, setSortOption] = React.useState<SortOptions>(
    SortOptions.CreatedAt,
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex gap-1">
      <Input
        type="search"
        placeholder="Search..."
        className="bg-card"
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
              setSortingFn(() => SortFunctions[value as SortOptions]);
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
          <DropdownMenuCheckboxItem>
            Hide items in current list
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PackingItemsSortFilter;
