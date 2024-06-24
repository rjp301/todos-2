import type { ExpandedCategory } from "@/api/lib/types";

export const isCategoryFullyPacked = (category: ExpandedCategory) =>
  category.items.length > 0 && category.items.every((i) => i.packed);

export const isCategoryPartiallyPacked = (category: ExpandedCategory) =>
  category.items.some((i) => i.packed);

export const getSortOrderFromIndex = (
  sortOrders: number[],
  insertionIndex: number,
): number => {
  if (insertionIndex <= 0) return sortOrders[0] - 1;
  if (insertionIndex >= sortOrders.length)
    return sortOrders[sortOrders.length - 1] + 1;
  return (sortOrders[insertionIndex - 1] + sortOrders[insertionIndex]) / 2;
};

export const formatWeight = (value: number): string => {
  if (value < 10) return (Math.round(value * 100) / 100).toLocaleString("en");
  if (value < 100) return (Math.round(value * 10) / 10).toLocaleString("en");
  return Math.round(value).toLocaleString("en");
};
