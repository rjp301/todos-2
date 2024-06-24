const weightUnitOptions = ["g", "kg", "oz", "lb"] as const;
export type WeightUnit = (typeof weightUnitOptions)[number];

export const weightUnitsFull: Record<WeightUnit, string> = {
  g: "grams",
  kg: "kilograms",
  oz: "ounces",
  lb: "pounds",
};

export const weightUnits: Record<WeightUnit, string> = {
  g: "g",
  kg: "kg",
  oz: "oz",
  lb: "lb",
};
