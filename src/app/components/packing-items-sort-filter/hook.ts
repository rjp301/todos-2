import React from "react";

import type { ItemSelect } from "@/api/lib/types";
import useCurrentList from "@/app/hooks/use-current-list";
import { usePackingItemsSortFilterStore } from "./store";
import { FilterOptions, SortOptions } from "./types";

type FilteringFn = (item: ItemSelect) => boolean;
type SortingFn = (a: ItemSelect, b: ItemSelect) => number;

const filterSearchTerm = (item: ItemSelect, query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return (
    item.name.toLowerCase().includes(lowerCaseQuery) ||
    item.description.toLowerCase().includes(lowerCaseQuery)
  );
};

export function usePackingItemsSortFilter(
  allItems: ItemSelect[],
  opts: { ignoreSearch?: boolean } = {},
) {
  const { ignoreSearch = false } = opts;
  const { listItemIds } = useCurrentList();
  const { searchQuery, sortOption, filterOptions } =
    usePackingItemsSortFilterStore();

  const sortFunctions: Record<SortOptions, SortingFn> = {
    [SortOptions.CreatedAt]: (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    [SortOptions.Name]: (a, b) => a.name.localeCompare(b.name),
    [SortOptions.Description]: (a, b) =>
      a.description.localeCompare(b.description),
    [SortOptions.Weight]: (a, b) => a.weight - b.weight,
  };

  const filterFunctions: Record<FilterOptions, FilteringFn> = {
    [FilterOptions.NotInList]: (item) => !listItemIds.has(item.id),
  };

  const filterFunction: FilteringFn = (item) =>
    Object.entries(filterOptions)
      .filter(([_, value]) => value)
      .every(([filter]) => filterFunctions[filter as FilterOptions](item));

  const itemsSortedFiltered = React.useMemo(
    () =>
      allItems
        .filter((item) =>
          ignoreSearch ? true : filterSearchTerm(item, searchQuery),
        )
        .filter(filterFunction)
        .sort(sortFunctions[sortOption]),

    [allItems, searchQuery, sortOption, filterOptions, listItemIds],
  );

  return itemsSortedFiltered;
}