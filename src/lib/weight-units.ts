import type { ExpandedCategoryItem, WeightUnit } from "./types";

const gramsConversions: Record<WeightUnit, number> = {
  oz: 28.3495,
  lb: 453.592,
  kg: 1000,
  g: 1,
};

export const getItemWeightInUnit = (
  item: { weight: number; weightUnit: string },
  unit: WeightUnit,
) => {
  const weightUnit = item.weightUnit as WeightUnit;
  if (weightUnit in gramsConversions) {
    const weight_g = item.weight * gramsConversions[weightUnit];
    return weight_g / gramsConversions[unit];
  }
  return NaN;
};

export const getCategoryWeight = (
  items: ExpandedCategoryItem[],
  unit: WeightUnit,
) =>
  items.reduce((acc, item) => {
    const itemWeight = getItemWeightInUnit(item.itemData, unit);
    return acc + itemWeight * item.quantity;
  }, 0);
