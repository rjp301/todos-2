import { atomWithStorage } from "jotai/utils";

export const sidebarOpenAtom = atomWithStorage<boolean>("sidebarOpen", false);
