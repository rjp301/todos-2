import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import React from "react";

export type DraggableState =
  | {
      type: "idle";
    }
  | {
      type: "preview";
      container: HTMLElement;
    }
  | {
      type: "is-dragging";
    }
  | {
      type: "is-dragging-over";
      closestEdge: Edge | null;
    };

export type DraggableStateClassnames = {
  [Key in DraggableState["type"]]?: React.HTMLAttributes<HTMLDivElement>["className"];
};

export default function useDraggableState() {
  const [draggableState, setDraggableState] = React.useState<DraggableState>({
    type: "idle",
  });

  const setDraggableIdle = () => setDraggableState({ type: "idle" });

  return { draggableState, setDraggableState, setDraggableIdle };
}
