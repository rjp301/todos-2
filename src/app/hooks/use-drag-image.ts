import React from "react";

export default function useDragImage() {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    const dragImage = ref.current;
    if (dragImage) {
      e.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  };

  return { ref, handleDragStart };
}
