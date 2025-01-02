import React from "react";
import { Laptop, Moon, Sun } from "lucide-react";
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
    icon: <Laptop className="size-4" />,
  },
  {
    value: "light",
    name: "Light",
    icon: <Sun className="size-4" />,
  },
  {
    value: "dark",
    name: "Dark",
    icon: <Moon className="size-4" />,
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
