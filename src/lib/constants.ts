export const NAVBAR_HEIGHT = "4rem";

export const DND_ENTITY_TYPE = "__entityType";
export enum DndEntityType {
  Category = "category",
  CategoryPlaceholder = "category-placeholder",
  CategoryItem = "category-item",
  Item = "item",
  List = "list",
}

export const isDndEntityType = (
  data: Record<string, unknown>,
  type: DndEntityType,
): boolean => {
  return data[DND_ENTITY_TYPE] === type;
};

export const ACCENT_COLOR = "grass" as const;
