import React from "react";

import type { ItemSelect } from "@/api/lib/types";
import useCurrentList from "@/app/hooks/use-current-list";

type FilteringFn = (item: ItemSelect) => boolean;
type SortingFn = (a: ItemSelect, b: ItemSelect) => number;

enum SortOptions {
  CreatedAt = "Creation time",
  Name = "Name",
  Description = "Description",
  Weight = "Weight",
}
export const sortOptions = Object.values(SortOptions);

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

export function usePackingItemsSortFilter(allItems: ItemSelect[]) {
  const { listItemIds } = useCurrentList();

  const [sortOption, setSortOption] = React.useState<SortOptions>(
    SortOptions.CreatedAt,
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const itemsSortedFiltered = React.useMemo(
    () =>
      allItems
        .filter((item) => filterSearchTerm(item, searchQuery))
        .sort(SortFunctions[sortOption]),

    [allItems, searchQuery, sortOption],
  );

  return {
    searchQuery,
    setSearchQuery,
    sortOption,
    sortOptions: Object.values(SortOptions),
    setSortOption,
    itemsSortedFiltered,
  };
}
