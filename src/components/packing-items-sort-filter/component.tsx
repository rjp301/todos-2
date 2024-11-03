import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  ArrowDownWideNarrow,
  Download,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { FilterOptions, SortOptions } from "./types";
import { useAtom } from "jotai";
import { filterOptionsAtom, searchStringAtom, sortOptionAtom } from "./store";
import { cn } from "@/lib/utils";

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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="size-8 shrink-0">
            <MoreHorizontal size="1rem" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="grid gap-5">
          <div className="grid gap-3">
            <div className="flex items-center text-xs font-bold">
              <ArrowDownWideNarrow className="mr-1.5 size-3" />
              <span>Sort</span>
            </div>
            <RadioGroup
              className="grid grid-cols-2"
              value={sortOption}
              onValueChange={(value) => {
                setSortOption(value as SortOptions);
              }}
            >
              {Object.values(SortOptions).map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <RadioGroupItem key={option} value={option} />
                  <Label>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center text-xs font-bold">
              <Filter className="mr-1.5 size-3" />
              <span>Filter</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={filterOptions[FilterOptions.NotInList]}
                onCheckedChange={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    [FilterOptions.NotInList]: !prev[FilterOptions.NotInList],
                  }))
                }
              />
              <Label>Hide gear in current list</Label>
            </div>
          </div>
          <a
            href="/download/items"
            download
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            <Download className="mr-2 size-4" />
            <span>Download CSV</span>
          </a>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PackingItemsSortFilter;
