import { atomWithStorage } from "jotai/utils";

export const mobileSidebarOpenAtom = atomWithStorage<boolean>(
  "mobileSidebarOpen",
  false,
);
export const desktopSidebarOpenAtom = atomWithStorage<boolean>(
  "desktopSidebarOpen",
  false,
);
