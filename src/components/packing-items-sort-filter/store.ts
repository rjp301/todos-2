import { create } from "zustand";
import { FilterOptions, SortOptions } from "./types";
import { persist } from "zustand/middleware";

interface State {
  searchQuery: string;
  sortOption: SortOptions;
  filterOptions: Record<FilterOptions, boolean>;
}

const DEFAULT_STATE: State = {
  searchQuery: "",
  sortOption: SortOptions.CreatedAt,
  filterOptions: {
    [FilterOptions.NotInList]: false,
  },
};

interface Actions {
  setSearchQuery: (query: string) => void;
  setSortOption: (option: SortOptions) => void;
  toggleFilterOption: (option: FilterOptions) => void;
  reset: () => void;
}

const usePackingItemsSortFilterStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortOption: (option) => set({ sortOption: option }),
      toggleFilterOption: (option) =>
        set((state) => ({
          filterOptions: {
            ...state.filterOptions,
            [option]: !state.filterOptions[option],
          },
        })),
      reset: () => set(DEFAULT_STATE),
    }),
    { name: "items-sort-filter-store" },
  ),
);

export default usePackingItemsSortFilterStore;
