import React from "react";
import { Drawer, DrawerContent } from "../ui/drawer";
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

type Props = {
  item: ItemSelect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ItemEditor: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, itemId } = props;

  const { updateItem } = useMutations();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-2/3">
        <form className="flex w-full flex-col gap-2 px-4 py-2">
          <div className="py-2 text-lg font-bold">Edit Item</div>
          {itemId}
          <Input placeholder="Unnamed Item" />
          <Textarea placeholder="Add a description" />
          <div className="flex gap-2">
            <Input type="number" />
            <Select
              value={item.itemData.weightUnit}
              onValueChange={(value) =>
                updateItem.mutate({
                  itemId: item.itemData.id,
                  data: { weightUnit: value as WeightUnit },
                })
              }
            >
              <SelectTrigger className="h-auto border-none p-0 px-2 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(weightUnits).map((unit) => (
                  <SelectItem value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default ItemEditor;
