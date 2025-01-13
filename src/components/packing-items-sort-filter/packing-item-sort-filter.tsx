import React from "react";

import { FilterOptions, SortOptions } from "./types";
import { useAtom } from "jotai";
import { filterOptionsAtom, searchStringAtom, sortOptionAtom } from "./store";
import {
  Button,
  Checkbox,
  Heading,
  IconButton,
  Popover,
  RadioGroup,
  Text,
  TextField,
} from "@radix-ui/themes";

const PackingItemsSortFilter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchStringAtom);
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  const [filterOptions, setFilterOptions] = useAtom(filterOptionsAtom);

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-1">
      <TextField.Root
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      >
        {searchQuery.length > 0 && (
          <TextField.Slot side="right">
            <IconButton
              size="1"
              radius="full"
              variant="ghost"
              color="red"
              onClick={() => setSearchQuery("")}
            >
              <i className="fa-solid fa-xmark" />
            </IconButton>
          </TextField.Slot>
        )}
        <TextField.Slot side="left">
          <i className="fa-solid fa-search" />
        </TextField.Slot>
      </TextField.Root>
      <Popover.Root>
        <Popover.Trigger>
          <IconButton variant="surface" color="gray">
            <i className="fa-solid fa-ellipsis" />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content className="z-30 grid gap-5">
          <div className="grid gap-3">
            <Heading as="h4" size="2" weight="medium">
              <i className="fa-solid fa-arrow-down-wide-short mr-1.5" />
              Sort
            </Heading>
            <RadioGroup.Root
              className="grid grid-cols-2"
              value={sortOption}
              onValueChange={(value) => {
                setSortOption(value as SortOptions);
              }}
            >
              {Object.values(SortOptions).map((option) => (
                <RadioGroup.Item key={option} value={option}>
                  {option}
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </div>
          <div className="grid gap-3">
            <Heading as="h4" size="2" weight="medium">
              <i className="fa-solid fa-filter mr-1.5" />
              Filter
            </Heading>
            <Text as="label" size="2" className="flex gap-2">
              <Checkbox
                checked={filterOptions[FilterOptions.NotInList]}
                onCheckedChange={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    [FilterOptions.NotInList]: !prev[FilterOptions.NotInList],
                  }))
                }
              />
              Hide gear in current list
            </Text>
          </div>
          <Button asChild variant="soft">
            <a href="/download/items" download>
              <i className="fa-solid fa-download" />
              <span>Download CSV</span>
            </a>
          </Button>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export default PackingItemsSortFilter;
