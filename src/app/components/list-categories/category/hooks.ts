import { useDraggingStore } from "../dragging-store";

export const useIsDragging = (categoryId: string) => {
  return useDraggingStore((state) => state.draggingCategoryId === categoryId);
};
