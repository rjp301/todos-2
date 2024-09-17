import { useAtomValue } from "jotai/react";
import React from "react";
import { useCookies } from "react-cookie";
import { useMediaQuery } from "usehooks-ts";
import { themeAtom } from "./store";

const MEDIA_QUERY_STR = "(prefers-color-scheme: dark)";

const setAppTheme = (theme: "light" | "dark") => {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

export function ThemeListener() {
  const theme = useAtomValue(themeAtom);
  const [_, setCookie, removeCookie] = useCookies(["theme"]);

  const isDark = useMediaQuery(MEDIA_QUERY_STR);

  React.useEffect(() => {
    if (theme === "system") {
      removeCookie("theme", { path: "/" });
      setAppTheme(isDark ? "dark" : "light");
      return;
    }

    setCookie("theme", theme, { path: "/" });
    setAppTheme(theme);
  }, [theme, isDark]);

  return null;
}
