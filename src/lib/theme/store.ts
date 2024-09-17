import { atomWithStorage } from "jotai/utils";

export type Theme = "dark" | "light" | "system";
export const themeLabels: Record<Theme, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

export const themeAtom = atomWithStorage<Theme>("theme", "system");
