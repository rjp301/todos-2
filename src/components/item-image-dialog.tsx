import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Save, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemSelect } from "@/lib/types";
import useMutations from "@/hooks/use-mutations";
import { Input } from "./ui/input";
import ItemImage from "./item-image";

interface Props {
  item: ItemSelect;
}

const ItemImageDialog: React.FC<Props> = (props) => {
  const { item } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState(item.image ?? "");
  const { updateItem } = useMutations();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex h-full">
        <ItemImage
          url={item.image}
          size="sm"
          className={cn(
            "w-16",
            item.image ? "h-16" : "h-full min-h-6 bg-muted/50",
            "outline-1 outline-offset-1 outline-primary transition-all hover:outline",
          )}
        />
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader className="text-left">
          <DialogTitle>Update {item.name} Image</DialogTitle>
          <DialogDescription>Provide a URL to an image</DialogDescription>
        </DialogHeader>

        <form
          id="image-form"
          onSubmit={(e) => {
            e.preventDefault();
            updateItem.mutate({ itemId: item.id, data: { image: value } });
            setIsOpen(false);
          }}
        >
          <Input
            type="url"
            placeholder="Image Url"
            onChange={(e) => setValue(e.target.value)}
            onFocus={(e) => e.target.select()}
            value={value}
          />
        </form>
        <ItemImage url={value} size="lg" className="aspect-square" />

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            disabled={updateItem.isPending}
            onClick={() => {
              setValue("");
              updateItem.mutate({ itemId: item.id, data: { image: null } });
              setIsOpen(false);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Image
          </Button>
          <Button
            type="submit"
            form="image-form"
            disabled={updateItem.isPending}
          >
            <Save className="mr-2 size-4" />
            <span>Save</span>
          </Button>
        </DialogFooter>
        <input type="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default ItemImageDialog;
