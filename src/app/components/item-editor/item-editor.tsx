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
import ServerInput from "../input/server-input";

type Props = {
  item: ItemSelect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ItemEditor: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, item } = props;

  const { updateItem } = useMutations();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-2/3">
        <form className="flex w-full flex-col gap-2 px-4 py-2">
          <div className="py-2 text-lg font-bold">Edit Item</div>
          {item.name}
          <Input placeholder="Unnamed Item" />
          <Textarea placeholder="Add a description" />
          <div className="grid grid-cols-2 gap-2">
            <ServerInput
              type="number"
              min={0}
              selectOnFocus
              placeholder="Weight"
              currentValue={item.weight.toLocaleString()}
              onUpdate={(weight) =>
                updateItem.mutate({
                  itemId: item.id,
                  data: { weight: Number(weight) },
                })
              }
            />
            <Select
              value={item.weightUnit}
              onValueChange={(value) =>
                updateItem.mutate({
                  itemId: item.id,
                  data: { weightUnit: value as WeightUnit },
                })
              }
            >
              <SelectTrigger>
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
