import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Laptop, Moon, Sun } from "lucide-react";
import { themeAtom, type Theme } from "./store";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai/react";

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
    <ToggleGroup
      id="default-weight"
      className="h-auto w-full rounded-lg bg-muted/50 p-1"
      type="single"
      value={theme}
      onValueChange={(value) => {
        if (!value) return;
        setTheme(value as Theme);
      }}
    >
      {themeOptions.map((t) => (
        <ToggleGroupItem
          key={t.value}
          value={t.value}
          title={t.name}
          className={cn(
            "h-8 w-8 transition-all",
            t.value === theme && "w-auto flex-1",
          )}
        >
          <span>{t.icon}</span>
          <span
            className={cn(
              "w-0 overflow-hidden",
              t.value === theme && "ml-2 w-auto",
            )}
          >
            {t.name}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default ThemeToggle;
