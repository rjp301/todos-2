import React from "react";
import { cn } from "@/lib/utils";
import { formatWeight } from "@/lib/utils";
import Gripper from "@/components/base/gripper";
import useMutations from "@/hooks/use-mutations";
import type { ItemSelect } from "@/lib/types";
import invariant from "tiny-invariant";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/hooks/use-draggable-state";
import { DND_ENTITY_TYPE, DndEntityType } from "@/lib/constants";
import useItemEditorStore from "../item-editor/store";
import { DropdownMenu, IconButton, Portal, Text } from "@radix-ui/themes";
import RadixProvider from "../base/radix-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";

interface Props {
  item: ItemSelect;
  isOverlay?: boolean;
  isIncludedInList?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const PackingItem: React.FC<Props> = (props) => {
  const { item, isOverlay, isIncludedInList } = props;
  const { deleteItem, duplicateItem } = useMutations();

  const [ConfirmDeleteDialog, confirmDelete] = useConfirmDialog({
    title: "Delete Gear",
    description:
      "Are you sure you want to delete this gear? This cannot be undone.",
  });

  const { openEditor } = useItemEditorStore();

  const ref = React.useRef<HTMLDivElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);

  const itemName = item.name || "Unnamed Gear";

  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  React.useEffect(() => {
    const element = ref.current;
    const gripper = gripperRef.current;
    invariant(element);
    invariant(gripper);

    return draggable({
      element: gripper,
      canDrag: () => !isIncludedInList,
      getInitialData: () => ({
        [DND_ENTITY_TYPE]: DndEntityType.Item,
        ...item,
      }),
      onGenerateDragPreview({ nativeSetDragImage }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: pointerOutsideOfPreview({
            x: "-16px",
            y: "-16px",
          }),
          render({ container }) {
            setDraggableState({ type: "preview", container });
          },
        });
      },
      onDragStart() {
        setDraggableState({ type: "is-dragging" });
      },
      onDrop() {
        setDraggableIdle();
      },
    });
  }, [item, isIncludedInList]);

  return (
    <>
      <ConfirmDeleteDialog />
      <div
        ref={ref}
        data-item-id={item.id}
        title={itemName || "Unnamed Gear"}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-2 text-left transition-colors ease-in-out hover:bg-accentA-2",
          draggableStyles[draggableState.type],
          isOverlay && "w-64 rounded-2 border bg-gray-2",
          isIncludedInList && "opacity-50",
        )}
      >
        <Gripper ref={gripperRef} />
        <div
          role="button"
          className="flex flex-1 flex-col"
          onClick={() => openEditor(item)}
        >
          <Text
            size="2"
            weight="medium"
            className={cn(!item.name && "text-muted-foreground italic")}
          >
            {itemName}
          </Text>
          <Text size="2" color="gray">
            {item.description}
          </Text>
        </div>
        <Text color="gray" size="2">
          <span>{formatWeight(item.weight)}</span>
          <span>{item.weightUnit}</span>
        </Text>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger onClick={(e) => e.stopPropagation()}>
            <IconButton
              variant="ghost"
              color="gray"
              title="List Actions"
              size="1"
              radius="full"
            >
              <span className="sr-only">Open menu</span>
              <i className="fa-solid fa-ellipsis" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start" className="z-30">
            <DropdownMenu.Label>Actions</DropdownMenu.Label>
            <DropdownMenu.Item
              onClick={async () => {
                const ok = await confirmDelete();
                if (ok) {
                  deleteItem.mutate({ itemId: item.id });
                }
              }}
            >
              <Text asChild color="gray">
                <i className="fa-solid fa-backspace w-4 text-center" />
              </Text>
              Delete
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                duplicateItem.mutate({ itemId: item.id });
              }}
            >
              <Text asChild color="gray">
                <i className="fa-solid fa-copy w-4 text-center" />
              </Text>
              Duplicate
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      {draggableState.type === "preview" ? (
        <Portal container={draggableState.container}>
          <RadixProvider>
            <PackingItem item={item} isOverlay />
          </RadixProvider>
        </Portal>
      ) : null}
    </>
  );
};

export default PackingItem;
