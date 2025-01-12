import React from "react";
import { useUnmount } from "usehooks-ts";
import { TextField } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

type Props = {
  currentValue: string | undefined | null;
  onUpdate: (value: string | undefined) => void;
  selectOnFocus?: boolean;
} & React.ComponentProps<typeof TextField.Root>;

const ServerInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { currentValue, onUpdate, selectOnFocus, ...rest } = props;

  const [value, setValue] = React.useState<string>(currentValue ?? "");

  const update = () => {
    if (value !== currentValue) onUpdate(value);
  };

  useUnmount(update);

  return (
    <TextField.Root
      {...rest}
      variant="soft"
      color="gray"
      ref={ref}
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      onBlur={() => {
        update();
      }}
      onFocus={(ev) => {
        if (selectOnFocus) ev.target.select();
      }}
      onKeyDown={(ev) => {
        const target = ev.target as HTMLInputElement;
        if (ev.key === "Enter" || ev.key === "Escape") {
          ev.preventDefault();
          update();
          target.blur();
        }
      }}
      autoComplete="off"
      className={cn("w-full bg-gray-1", props.className)}
    />
  );
});

export default ServerInput;
