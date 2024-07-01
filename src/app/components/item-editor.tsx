import React from "react";
import { Drawer, DrawerContent } from "./ui/drawer";

type Props = {
  itemId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ItemEditor: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, itemId } = props;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-2/3">
        <div className="w-full px-4">
          <div className="py-4 text-lg font-bold">Edit Item</div>
          {itemId}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ItemEditor;
