import React from "react";
import { cn } from "@/app/lib/utils";
import { Textarea } from "../ui/textarea";

type Props = {
  currentValue: string | undefined;
  onUpdate: (value: string | undefined) => void;
  selectOnFocus?: boolean;
} & React.ComponentProps<typeof Textarea>;

export default function ServerTextarea(
  props: Props,
): ReturnType<React.FC<Props>> {
  const { currentValue, onUpdate, selectOnFocus, ...rest } = props;

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = React.useState<string>(currentValue ?? "");

  const update = () => {
    if (value !== currentValue) onUpdate(value);
  };

  return (
    <Textarea
      {...rest}
      className={cn(
        props.className,
        "h-auto px-2 py-1 shadow-none placeholder:italic",
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
