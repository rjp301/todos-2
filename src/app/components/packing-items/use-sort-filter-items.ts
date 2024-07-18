import type { ItemSelect } from "@/api/lib/types";
import React from "react";

enum SortOptions {
  CreatedAt = "Created At",
  Name = "Name",
  Description = "Description",
  Weight = "Weight",
}

const sortOptions = Object.values(SortOptions);

const sortingFunction = (option: SortOptions) => {
  switch (option) {
    case SortOptions.CreatedAt:
      return (a: ItemSelect, b: ItemSelect) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    case SortOptions.Name:
      return (a: ItemSelect, b: ItemSelect) => a.name.localeCompare(b.name);
    case SortOptions.Description:
      return (a: ItemSelect, b: ItemSelect) =>
        a.description.localeCompare(b.description);
    case SortOptions.Weight:
      return (a: ItemSelect, b: ItemSelect) => a.weight - b.weight;
  }
};

const filterItems = (item: ItemSelect, query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return (
    item.name.toLowerCase().includes(lowerCaseQuery) ||
    item.description.toLowerCase().includes(lowerCaseQuery)
  );
};

export default function useSortFilterItems(items: ItemSelect[]) {
  const [sortOption, setSortOption] = React.useState<SortOptions>(
    SortOptions.CreatedAt,
  );
  const [filterQuery, setFilterQuery] = React.useState("");

  const handleSortChange = (option: string) => {
    setSortOption(option as SortOptions);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterQuery(e.target.value);
  };

  const itemsSorted = React.useMemo(
    () =>
      items
        .filter((item) => filterItems(item, filterQuery))
        .sort(sortingFunction(sortOption)),
    [items, filterQuery, sortOption],
  );

  return {
    itemsSorted,
    sortOptions,
    sortOption,
    filterQuery,
    handleSortChange,
    handleFilterChange,
  };
}
