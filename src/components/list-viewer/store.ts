import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  packedItems: Record<string, Set<string>>;
};

const initialState: State = {
  packedItems: {},
};

type Actions = {
  togglePackedItem: (listId: string, itemId: string) => void;
};

const useViewerStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      togglePackedItem: (listId, itemId) => set(state => {
        const packedItems = state.packedItems[listId] || new Set();
        if (packedItems.has(itemId)) {
          packedItems.delete(itemId);
        } else {
          packedItems.add(itemId);
        }
        return { packedItems: { ...state.packedItems, [listId]: packedItems } };
      }),
    }),
    { name: "viewer-store" },
  ),
);

export default useViewerStore;
