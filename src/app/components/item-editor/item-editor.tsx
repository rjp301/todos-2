import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { type WeightUnit, weightUnits } from "@/api/helpers/weight-units";
import useMutations from "@/app/hooks/useMutations";
import type { ItemSelect } from "@/api/lib/types";
import ServerInput from "../input/server-input";
import ItemForm from "./item-form";

type Props = {
  item: ItemSelect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ItemEditor: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, item } = props;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Item</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-auto px-4 py-2 pb-6">
          <ItemForm item={item} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ItemEditor;
