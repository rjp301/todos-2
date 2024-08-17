import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ItemSelect,
} from "@/api/lib/types";
import { v4 as uuid } from "uuid";

const MOCK_USER_ID = "mock-user-id";
const createdAt = () => new Date().toISOString();

export const initItem = (data?: Partial<ItemSelect>): ItemSelect => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  name: "",
  description: "",
  weight: 0,
  createdAt: createdAt(),
  weightUnit: "g",
  image: "",
  ...data,
});

export const initCategoryItem = (
  data?: Partial<ExpandedCategoryItem>,
): ExpandedCategoryItem => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  categoryId: uuid(),
  itemData: initItem(),
  createdAt: createdAt(),
  quantity: 1,
  sortOrder: 1,
  itemId: uuid(),
  packed: false,
  wornWeight: false,
  consWeight: false,
  ...data,
});

export const initCategory = (data?: ExpandedCategory): ExpandedCategory => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  name: "",
  sortOrder: 1,
  items: [],
  createdAt: createdAt(),
  listId: uuid(),
  weight: 0,
  packed: false,
  ...data,
});
