import React from "react";
import { cn } from "@/lib/utils";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from "tiny-invariant";
import {
  DND_ENTITY_TYPE,
  DndEntityType,
  isDndEntityType,
} from "@/lib/constants";
import useCurrentList from "@/hooks/use-current-list";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface Props {
  categoryId: string;
}

const isPermitted = (
  data: Record<string, unknown>,
  listItemIds: Set<string>,
) => {
  if (
    isDndEntityType(data, DndEntityType.Item) &&
    listItemIds.has(data.id as string)
  ) {
    return false;
  }
  const entities = [DndEntityType.CategoryItem, DndEntityType.Item];
  return entities.some((entity) => isDndEntityType(data, entity));
};

const EditorCategoryPlaceholder: React.FC<Props> = (props) => {
  const { categoryId } = props;
  const { list, listItemIds } = useCurrentList();

  const ref = React.useRef<HTMLTableRowElement>(null);

  const [isDraggingOver, setDraggingOver] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return isPermitted(source.data, listItemIds);
        },
        getData() {
          return {
            [DND_ENTITY_TYPE]: DndEntityType.CategoryPlaceholder,
            id: DndEntityType.CategoryPlaceholder,
            categoryId,
          };
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ source }) {
          if (!isPermitted(source.data, listItemIds)) return;
          setDraggingOver(true);
        },
        onDrag({ source }) {
          if (!isPermitted(source.data, listItemIds)) return;
          setDraggingOver((current) => {
            if (current === true) {
              return current;
            }
            return true;
          });
        },
        onDragLeave() {
          setDraggingOver(false);
        },
        onDrop() {
          setDraggingOver(false);
        },
      }),
    );
  }, []);

  if (!list) return null;

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "flex h-12 w-full items-center justify-center text-xs transition-colors hover:bg-destructive/10",
          isDraggingOver && "bg-muted",
        )}
      >
        <Badge variant="outline" className="bg-background">
          NO GEAR
        </Badge>
      </div>
      <Separator />
    </>
  );
};

export default EditorCategoryPlaceholder;
