import React from "react";
import { useController, type FieldValues, type Path } from "react-hook-form";
import type { ControlledInputProps, FieldOptions } from "./types";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/app/components/ui/form";
import { Textarea } from "../../ui/textarea";

type Props<
  T extends FieldValues,
  TFieldName extends Path<T>,
> = ControlledInputProps<T, TFieldName> &
  FieldOptions &
  React.HTMLProps<HTMLTextAreaElement>;

const ControlledTextarea = <T extends FieldValues, TFieldName extends Path<T>>(
  props: Props<T, TFieldName>,
) => {
  const { control, name, label, description, ...rest } = props;
  const { field } = useController({ control, name });

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Textarea {...field} {...rest} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export default ControlledTextarea;
