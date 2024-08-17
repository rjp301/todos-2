import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ItemSelect,
} from "@/api/lib/types";
import { v4 as uuid } from "uuid";

const MOCK_USER_ID = "mock-user-id";
const createdAt = () => new Date().toISOString();

export const initItem = (): ItemSelect => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  name: "",
  description: "",
  weight: 0,
  createdAt: createdAt(),
  weightUnit: "g",
  image: "",
});

export const initCategoryItem = (
  item: ItemSelect,
  categoryId: string,
): ExpandedCategoryItem => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  categoryId,
  itemData: item,
  createdAt: createdAt(),
  quantity: 1,
  sortOrder: 1,
  itemId: item.id,
  packed: false,
  wornWeight: false,
  consWeight: false,
});

export const initCategory = (listId: string): ExpandedCategory => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  name: "",
  sortOrder: 1,
  items: [],
  createdAt: createdAt(),
  listId,
  weight: 0,
  packed: false,
});
