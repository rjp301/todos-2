import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  isMobileSidebarOpen: boolean;
  isDesktopSidebarOpen: boolean;
}

const DEFAULT_STATE: State = {
  isDesktopSidebarOpen: true,
  isMobileSidebarOpen: false,
};

interface Actions {
  toggleMobileSidebar: (open?: boolean) => void;
  toggleDesktopSidebar: (open?: boolean) => void;
  reset: () => void;
}

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      toggleMobileSidebar: (open) =>
        set((state) => ({
          isMobileSidebarOpen: open ?? !state.isMobileSidebarOpen,
        })),
      toggleDesktopSidebar: (open) =>
        set((state) => ({
          isDesktopSidebarOpen: open ?? !state.isDesktopSidebarOpen,
        })),
      reset: () => set(DEFAULT_STATE),
    }),
    { name: "packlighter-store" },
  ),
);
