import { weightUnits, type ItemSelect } from "@/lib/types";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useMutations from "@/hooks/use-mutations";
import useItemEditorStore from "./store";
import { initItem } from "@/lib/init";
import ItemImage from "../item-image";
import { Button, IconButton, Select, Text, TextField } from "@radix-ui/themes";

const ItemForm: React.FC = () => {
  const { item, closeEditor } = useItemEditorStore();

  const methods = useForm<ItemSelect>({
    defaultValues: initItem(item),
    resolver: zodResolver(z.custom<ItemSelect>()),
  });

  const { control, handleSubmit, watch } = methods;
  const { updateItem, addItem } = useMutations();

  const onSubmit = handleSubmit((data) => {
    item
      ? updateItem.mutate({ itemId: item.id, data })
      : addItem.mutate({ data });
    closeEditor();
  });

  const imageUrl = watch("image");

  return (
    <FormProvider {...methods}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <input type="submit" hidden />
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <div className="grid gap-2">
              <Text as="label" size="2" weight="medium">
                Name
              </Text>
              <TextField.Root placeholder="Great piece of kit" {...field} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <div className="grid gap-2">
              <Text as="label" size="2" weight="medium">
                Description
              </Text>
              <TextField.Root
                placeholder="Some marvellous and completely necessary piece of kit"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="weight"
          render={({ field }) => (
            <div className="grid gap-2">
              <Text as="label" size="2" weight="medium">
                Weight
              </Text>
              <TextField.Root
                placeholder="Weight"
                type="number"
                min={0}
                onFocus={(e) => e.target.select()}
                {...field}
              >
                <TextField.Slot side="right">
                  <Controller
                    control={control}
                    name="weightUnit"
                    render={({ field }) => (
                      <Select.Root
                        size="1"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <Select.Trigger variant="ghost" placeholder="Unit" />
                        <Select.Content>
                          {weightUnits.map(({ symbol, name }) => (
                            <Select.Item key={symbol} value={symbol}>
                              {name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                </TextField.Slot>
              </TextField.Root>
            </div>
          )}
        />

        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <div className="grid gap-2">
              <Text as="label" size="2" weight="medium">
                Image URL
              </Text>
              <TextField.Root
                type="url"
                placeholder="https://example.com/image.jpg"
                {...field}
                value={field.value || ""}
              >
                {field.value && (
                  <TextField.Slot side="right">
                    <IconButton
                      type="button"
                      size="1"
                      variant="soft"
                      color="red"
                      onClick={() => field.onChange("")}
                    >
                      <i className="fa-solid fa-xmark" />
                    </IconButton>
                  </TextField.Slot>
                )}
              </TextField.Root>
            </div>
          )}
        />

        {imageUrl && (
          <ItemImage url={imageUrl} size="sm" className="mx-auto size-32" />
        )}
        <div className="grid w-full gap-2 pt-8">
          <Button
            className="w-full"
            type="button"
            variant="soft"
            color="gray"
            onClick={closeEditor}
          >
            Cancel
          </Button>
          <Button type="submit">
            <i className="fa-solid fa-save" />
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ItemForm;
