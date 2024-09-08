import type { ItemSelect } from "@/lib/types";
import { create } from "zustand";

type State = {
  item: ItemSelect | undefined;
  isEditorOpen: boolean;
};

const initialState: State = {
  item: undefined,
  isEditorOpen: false,
};

type Actions = {
  openEditor: (item?: ItemSelect) => void;
  closeEditor: () => void;
};

export const useItemEditorStore = create<State & Actions>()((set) => ({
  ...initialState,
  openEditor: (item) => set({ item, isEditorOpen: true }),
  closeEditor: () => set({ item: undefined, isEditorOpen: false }),
}));
