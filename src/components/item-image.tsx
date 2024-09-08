import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Save, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemSelect } from "@/lib/types";
import useMutations from "@/hooks/use-mutations";
import { Input } from "./ui/input";

interface Props {
  item: ItemSelect;
}

const ItemImage: React.FC<Props> = (props) => {
  const { item } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState(item.image ?? "");
  const { updateItem } = useMutations();

  // React.useEffect(() => {
  //   const pasteFiles = (e: ClipboardEvent) => {
  //     if (isOpen && e.clipboardData?.files?.length) {
  //       updateMutation.mutate(e.clipboardData.files[0]);
  //     }
  //   };

  //   document.addEventListener("paste", pasteFiles);
  //   return () => {
  //     document.removeEventListener("paste", pasteFiles);
  //   };
  // }, [isOpen, updateMutation]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex h-full">
        <div
          className={cn(
            "flex w-16 flex-1 items-center justify-center rounded-sm p-0.5",
            item.image ? "h-16 bg-white" : "h-full min-h-6 bg-muted/50",
            "outline-1 outline-offset-1 outline-primary transition-all hover:outline",
          )}
        >
          {item.image && (
            <img
              className="h-full w-full object-contain"
              src={item.image}
              alt={item.name}
            />
          )}
        </div>
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
        <div
          className={cn(
            "flex aspect-square items-center justify-center rounded-md p-2 text-muted-foreground",
            value ? "bg-white" : "bg-muted",
          )}
        >
          {value ? (
            <img
              className="h-full w-full object-contain"
              src={value}
              alt={item.name}
            />
          ) : (
            "No Image"
          )}
        </div>

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

export default ItemImage;
