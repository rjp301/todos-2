import type { ItemSelect } from "@/lib/types";
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
import useMutations from "@/app/hooks/use-mutations";
import { useItemEditorStore } from "./store";
import { initItem } from "@/app/lib/init";

const ItemForm: React.FC = () => {
  const { item, closeEditor } = useItemEditorStore();

  const methods = useForm<ItemSelect>({
    defaultValues: initItem(item),
    resolver: zodResolver(z.custom<ItemSelect>()),
  });

  const { control, handleSubmit } = methods;
  const { updateItem, addItem } = useMutations();

  const onSubmit = handleSubmit((data) => {
    item
      ? updateItem.mutate({ itemId: item.id, data })
      : addItem.mutate({ data });
    closeEditor();
  });

  return (
    <Form {...methods}>
      <form className="space-y-2" onSubmit={onSubmit}>
        <input type="submit" hidden />
        <ControlledTextInput
          control={control}
          name="name"
          label="Name"
          placeholder="Unnamed Gear"
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
        <div className="grid w-full gap-2 pt-8">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button
            className="w-full"
            type="button"
            variant="outline"
            onClick={closeEditor}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ItemForm;
