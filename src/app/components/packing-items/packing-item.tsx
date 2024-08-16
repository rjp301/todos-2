import React from "react";
import DeleteButton from "@/app/components/base/delete-button";
import { cn } from "@/app/lib/utils";
import { formatWeight } from "@/app/lib/utils";
import Gripper from "@/app/components/base/gripper";
import useMutations from "@/app/hooks/use-mutations";
import type { ItemSelect } from "@/api/lib/types";
import invariant from "tiny-invariant";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/app/hooks/use-draggable-state";
import { createPortal } from "react-dom";

interface Props {
  item: ItemSelect;
  isOverlay?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const PackingItem: React.FC<Props> = (props) => {
  const { item, isOverlay } = props;
  const { deleteItem } = useMutations();

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
      getInitialData: () => item,
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
  }, [item]);

  return (
    <>
      <div
        ref={ref}
        data-item-id={item.id}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-secondary",
          draggableStyles[draggableState.type],
          isOverlay && "w-64 rounded border bg-card",
        )}
      >
        <Gripper reference={gripperRef} />
        <div className="flex flex-1 flex-col">
          <span className={cn(!item.name && "italic text-muted-foreground")}>
            {itemName}
          </span>
          <span className="text-muted-foreground">{item.description}</span>
        </div>
        <span className="flex gap-1 text-muted-foreground">
          <span>{formatWeight(item.weight)}</span>
          <span>{item.weightUnit}</span>
        </span>
        <DeleteButton
          handleDelete={() =>
            deleteItem.mutate({ itemId: item.id, itemName: itemName })
          }
        />
      </div>
      {draggableState.type === "preview"
        ? createPortal(
            <PackingItem item={item} isOverlay />,
            draggableState.container,
          )
        : null}
    </>
  );
};

export default PackingItem;
