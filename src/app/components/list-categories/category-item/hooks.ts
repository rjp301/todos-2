import { useDraggingStore } from "../dragging-store";

export const useIsDragging = (categoryItemId: string) => {
  return useDraggingStore(
    (state) => state.draggingCategoryItemId === categoryItemId,
  );
};
