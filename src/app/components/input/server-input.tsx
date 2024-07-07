import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/app/lib/utils";

type Props = {
  currentValue: string | undefined | null;
  onUpdate: (value: string | undefined) => void;
  selectOnFocus?: boolean;
  inline?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function ServerInput(props: Props): ReturnType<React.FC<Props>> {
  const { currentValue, onUpdate, selectOnFocus, inline, ...rest } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [value, setValue] = React.useState<string>(currentValue ?? "");

  const update = () => {
    if (value !== currentValue) onUpdate(value);
  };

  return (
    <Input
      {...rest}
      className={cn(
        props.className,
        inline &&
          "h-auto truncate border-none px-2 py-1 shadow-none outline-primary transition-all placeholder:italic hover:outline",
      )}
      ref={inputRef}
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      onBlur={() => update()}
      onFocus={() => selectOnFocus && inputRef.current?.select()}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" || ev.key === "Escape") {
          ev.preventDefault();
          update();
          inputRef.current?.blur();
        }
      }}
      autoComplete="off"
    />
  );
}
