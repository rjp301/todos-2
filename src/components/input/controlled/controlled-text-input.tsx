import React from "react";
import { useController, type FieldValues, type Path } from "react-hook-form";
import type { ControlledInputProps, FieldOptions } from "./types";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props<
  T extends FieldValues,
  TFieldName extends Path<T>,
> = ControlledInputProps<T, TFieldName> &
  FieldOptions &
  React.HTMLProps<HTMLInputElement>;

const ControlledTextInput = <T extends FieldValues, TFieldName extends Path<T>>(
  props: Props<T, TFieldName>,
) => {
  const { control, name, label, description, ...rest } = props;
  const { field } = useController({ control, name });

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Input {...field} {...rest} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export default ControlledTextInput;
