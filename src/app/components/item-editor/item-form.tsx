import type { ItemSelect } from "@/api/lib/types";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledTextInput from "../input/controlled/controlled-text-input";
import { Form } from "../ui/form";
import ControlledTextarea from "../input/controlled/controlled-textarea";
import ControlledNumberInput from "../input/controlled/controlled-number-input";
import ControlledSelect from "../input/controlled/controlled-select";
import { weightUnits } from "@/api/helpers/weight-units";
import { Button } from "../ui/button";
import { Save } from "lucide-react";

type Props = {
  item: ItemSelect;
};

const ItemForm: React.FC<Props> = (props) => {
  const { item } = props;

  const methods = useForm<ItemSelect>({
    defaultValues: item,
    resolver: zodResolver(z.custom<ItemSelect>()),
  });

  const { control } = methods;

  return (
    <Form {...methods}>
      <div className="space-y-2">
        <ControlledTextInput
          control={control}
          name="name"
          label="Name"
          placeholder="Unnamed Item"
          required
        />
        <ControlledTextarea
          control={control}
          name="description"
          label="Description"
          placeholder="Add a description"
        />
        <div className="grid grid-cols-2 gap-2">
          <ControlledNumberInput
            control={control}
            name="weight"
            label="Weight"
            placeholder="Weight"
            type="number"
            min={0}
            required
          />
          <ControlledSelect
            control={control}
            name="weightUnit"
            label="Weight Unit"
            options={Object.entries(weightUnits).map(([value, label]) => ({
              value,
              label,
            }))}
            placeholder="Select Unit"
          />
        </div>
      </div>
      <div className="grid w-full pt-6">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </Form>
  );
};

export default ItemForm;
