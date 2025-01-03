import React from "react";

import { cn } from "@/lib/utils";
import type { ItemSelect } from "@/lib/types";
import useMutations from "@/hooks/use-mutations";
import ItemImage from "./item-image";
import ResponsiveModal from "./base/responsive-modal";
import { Button, Heading, Text, TextField } from "@radix-ui/themes";

interface Props {
  item: ItemSelect;
}

const ItemImageDialog: React.FC<Props> = (props) => {
  const { item } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState(item.image ?? "");
  const { updateItem } = useMutations();

  return (
    <>
      <button
        className="flex h-full"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ItemImage
          url={item.image}
          size="sm"
          className={cn(
            "w-16",
            item.image ? "h-16" : "bg-gray-4 h-full min-h-6",
            "outline-primary outline-1 outline-offset-1 transition-all hover:outline",
          )}
        />
      </button>
      <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <header>
          <Heading size="3">Update {item.name} Image</Heading>
          <Text size="2" color="gray">
            Provide a URL to an image
          </Text>
        </header>

        <form
          id="image-form"
          onSubmit={(e) => {
            e.preventDefault();
            updateItem.mutate({ itemId: item.id, data: { image: value } });
            setIsOpen(false);
          }}
        >
          <TextField.Root
            type="url"
            placeholder="Image Url"
            onChange={(e) => setValue(e.target.value)}
            onFocus={(e) => e.target.select()}
            value={value}
          >
            <TextField.Slot>
              <i className="fa-solid fa-link" />
            </TextField.Slot>
          </TextField.Root>
        </form>
        <ItemImage url={value} size="lg" className="aspect-square" />

        <div className="grid gap-2 sm:flex sm:justify-end">
          <Button
            type="button"
            variant="soft"
            color="red"
            disabled={updateItem.isPending}
            onClick={() => {
              setValue("");
              updateItem.mutate({ itemId: item.id, data: { image: null } });
              setIsOpen(false);
            }}
          >
            <i className="fa-solid fa-trash" />
            Delete Image
          </Button>
          <Button
            type="submit"
            form="image-form"
            disabled={updateItem.isPending}
          >
            <i className="fa-solid fa-save" />
            Save
          </Button>
        </div>
        <input type="hidden" />
      </ResponsiveModal>
    </>
  );
};

export default ItemImageDialog;
