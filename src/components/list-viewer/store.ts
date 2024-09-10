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
  isItemPacked: (listId: string, itemId: string) => boolean;
};

const useViewerStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      togglePackedItem: (listId, itemId) =>
        set((state) => {
          const packedItems = state.packedItems[listId] || new Set();
          if (packedItems.has(itemId)) {
            packedItems.delete(itemId);
          } else {
            packedItems.add(itemId);
          }
          return {
            packedItems: { ...state.packedItems, [listId]: packedItems },
          };
        }),
      isItemPacked: (listId, itemId) => {
        const packedItems = get().packedItems[listId] || new Set();
        return packedItems.has(itemId);
      },
    }),
    { name: "viewer-store" },
  ),
);

export default useViewerStore;
