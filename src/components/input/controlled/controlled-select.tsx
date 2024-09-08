import { useController, type FieldValues, type Path } from "react-hook-form";
import type { ControlledInputProps, FieldOptions, InputOption } from "./types";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props<
  T extends FieldValues,
  TFieldName extends Path<T>,
> = ControlledInputProps<T, TFieldName> &
  FieldOptions & {
    options: InputOption[];
    placeholder?: string;
  };

const ControlledSelect = <T extends FieldValues, TFieldName extends Path<T>>(
  props: Props<T, TFieldName>,
) => {
  const { control, name, label, description, options, placeholder } = props;
  const { field } = useController({ control, name });

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export default ControlledSelect;
