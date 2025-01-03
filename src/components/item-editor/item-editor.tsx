import React from "react";
import ItemForm from "./item-form";
import useItemEditorStore from "./store";
import ResponsiveModal from "../base/responsive-modal";
import { Heading, Text } from "@radix-ui/themes";

const ItemEditor: React.FC = () => {
  const { closeEditor, openEditor, isEditorOpen, item } = useItemEditorStore();

  return (
    <ResponsiveModal
      open={isEditorOpen}
      onOpenChange={(open) => (open ? openEditor() : closeEditor())}
    >
      <header>
        <Heading as="h2" size="3">
          {item ? "Edit" : "Add"} Gear
        </Heading>
        <Text size="2" color="gray">
          {item
            ? `Update the details of ${item.name}`
            : "Got a new piece of kit?"}
        </Text>
      </header>
      <ItemForm />
    </ResponsiveModal>
  );
};

export default ItemEditor;
