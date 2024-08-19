import type { ItemSelect } from "@/api/lib/types";

export type FilteringFn = (item: ItemSelect) => boolean;
export type SortingFn = (a: ItemSelect, b: ItemSelect) => number;
