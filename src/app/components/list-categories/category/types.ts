import type { ExpandedCategory } from "@/api/lib/types";
import type { DraggableProvided } from "@hello-pangea/dnd";

export interface CategoryProps {
  category: ExpandedCategory;
  provided: DraggableProvided;
}
