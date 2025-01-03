import React from "react";
import { themeAtom, type Theme } from "./store";
import { useAtom } from "jotai/react";
import { SegmentedControl } from "@radix-ui/themes";

const themeOptions: {
  value: string;
  name: string;
  icon: React.ReactElement;
}[] = [
  {
    value: "system",
    name: "Auto",
    icon: <i className="fa-solid fa-laptop" />,
  },
  {
    value: "light",
    name: "Light",
    icon: <i className="fa-solid fa-sun" />,
  },
  {
    value: "dark",
    name: "Dark",
    icon: <i className="fa-solid fa-moon" />,
  },
];

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <SegmentedControl.Root
      value={theme}
      onValueChange={(value) => {
        setTheme(value as Theme);
      }}
    >
      {themeOptions.map((t) => (
        <SegmentedControl.Item key={t.value} value={t.value} title={t.name}>
          <span className="flex items-center gap-1.5">
            {t.icon}
            {t.name}
          </span>
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
};

export default ThemeToggle;
