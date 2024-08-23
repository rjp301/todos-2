import React from "react";
import type { ItemSelect } from "@/api/lib/types";
import ItemForm from "./item-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

type Props = {
  item?: ItemSelect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ItemEditor: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, item } = props;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Add"} Gear</DialogTitle>
        </DialogHeader>
        <ItemForm item={item} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ItemEditor;
