import React from "react";
import ItemForm from "./item-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { useItemEditorStore } from "./store";

const ItemEditor: React.FC = () => {
  const { closeEditor, openEditor, isEditorOpen, item } = useItemEditorStore();

  return (
    <Dialog
      open={isEditorOpen}
      onOpenChange={(open) => (open ? openEditor() : closeEditor())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Add"} Gear</DialogTitle>
        </DialogHeader>
        <ItemForm />
      </DialogContent>
    </Dialog>
  );
};

export default ItemEditor;
