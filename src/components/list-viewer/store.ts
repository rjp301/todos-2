import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  packedItems: Record<string, string[]>;
};

const initialState: State = {
  packedItems: {},
};

type Actions = {
  togglePackedItem: (props: {
    packed: boolean;
    listId: string;
    itemId: string;
  }) => void;
  isItemPacked: (props: { listId: string; itemId: string }) => boolean;
};

const useViewerStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      togglePackedItem: ({ packed, listId, itemId }) =>
        set((state) => {
          const packedItems = state.packedItems[listId] || [];
          if (packed) {
            packedItems.push(itemId);
          } else {
            packedItems.filter((i) => i !== itemId);
          }
          return {
            packedItems: { ...state.packedItems, [listId]: packedItems },
          };
        }),
      isItemPacked: ({ listId, itemId }) => {
        const packedItems = get().packedItems[listId] || [];
        console.log(packedItems);
        return packedItems.includes(itemId);
      },
    }),
    { name: "viewer-store" },
  ),
);

export default useViewerStore;
