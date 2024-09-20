import { FilterOptions, SortOptions } from "./types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const sortOptionAtom = atomWithStorage<SortOptions>(
  "items-sorting",
  SortOptions.CreatedAt,
);
export const filterOptionsAtom = atomWithStorage<
  Record<FilterOptions, boolean>
>("items-filter", { [FilterOptions.NotInList]: false });

export const searchStringAtom = atom<string>("");
