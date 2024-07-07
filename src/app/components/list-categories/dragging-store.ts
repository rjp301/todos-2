import { create } from "zustand";

interface State {
  draggingCategoryId: string | null;
  draggingCategoryItemId: string | null;
}

interface Actions {
  setDraggingCategory: (id: string | null) => void;
  setDraggingCategoryItem: (id: string | null) => void;
  resetDragging: () => void;
}

const defaultState: State = {
  draggingCategoryId: null,
  draggingCategoryItemId: null,
};

export const useDraggingStore = create<State & Actions>()((set) => ({
  ...defaultState,
  setDraggingCategory: (id) => set({ draggingCategoryId: id }),
  setDraggingCategoryItem: (id) => set({ draggingCategoryItemId: id }),
  resetDragging: () => set(defaultState),
}));
