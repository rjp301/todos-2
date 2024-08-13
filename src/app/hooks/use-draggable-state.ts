import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";
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

export default function useDraggableState() {
  const [draggableState, setDraggableState] = React.useState<DraggableState>({
    type: "idle",
  });
  return { draggableState, setDraggableState };
}
