import { Plus } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import PackingList from "./packing-list";
import Loader from "@/app/components/base/loader";
import Error from "@/app/components/base/error";

import { cn } from "@/app/lib/utils";
import Placeholder from "@/app/components/base/placeholder";
import { listsQueryOptions } from "@/app/lib/queries.ts";
import useMutations from "@/app/hooks/useMutations";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type OnDragEndResponder,
  type OnDragStartResponder,
} from "react-beautiful-dnd";

export default function PackingLists(): ReturnType<React.FC> {
  const listsQuery = useQuery(listsQueryOptions);
  const { addList, reorderLists } = useMutations();

  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  const handleDragStart: OnDragStartResponder = (result) => {
    const { draggableId } = result;
    setDraggingId(draggableId);
  };

  const handleDragEnd: OnDragEndResponder = (result) => {
    const { destination, source, draggableId } = result;
    const items = listsQuery.data ?? [];
    const currentItem = items.find((item) => item.id === draggableId);

    if (!destination || !currentItem) return;

    const newItems = Array.from(items);
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, currentItem);

    setDraggingId(null);
    reorderLists.mutate(newItems);
  };

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold">Lists</span>
        <Button size="sm" variant="linkMuted" onClick={() => addList.mutate()}>
          <Plus size="1rem" className="mr-2" />
          Add List
        </Button>
      </header>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable droppableId="packing-lists">
          {(provided) => (
            <Card
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "h-full overflow-y-auto overflow-x-hidden py-2 transition-colors",
                draggingId && "border-primary",
              )}
            >
              {listsQuery.isLoading && <Loader />}
              {listsQuery.isError && <Error error={listsQuery.error} />}
              {listsQuery.isSuccess &&
                listsQuery.data?.map((list, index) => (
                  <Draggable key={list.id} draggableId={list.id} index={index}>
                    {(provided) => (
                      <PackingList
                        list={list}
                        provided={provided}
                        isDragging={draggingId === list.id}
                      />
                    )}
                  </Draggable>
                ))}
              {listsQuery.isSuccess && listsQuery.data.length === 0 && (
                <Placeholder message="No lists yet" />
              )}
            </Card>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
