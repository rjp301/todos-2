import { Plus } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PackingList from "./packing-list";
import Loader from "@/components/base/loader";
import Error from "@/components/base/error";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import Placeholder from "@/components/base/placeholder";
import { listsQueryOptions } from "@/app/lib/queries.ts";
import type { List } from "astro:db";
import useMutations from "@/app/hooks/useMutations";

export default function PackingLists(): ReturnType<React.FC> {
  const [activeList, setActiveList] = React.useState<
    typeof List.$inferSelect | null
  >(null);

  const listsQuery = useQuery(listsQueryOptions);

  const { addList, reorderLists } = useMutations();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor),
  );

  function handleDragStart(event: DragStartEvent) {
    if (!listsQuery.isSuccess) return;
    const active = listsQuery.data.find((i) => i.id === event.active.id);
    if (active) setActiveList(active);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveList(null);
    if (active.id === over?.id || !listsQuery.isSuccess) return;

    const oldIndex = listsQuery.data.findIndex((i) => i.id === active.id);
    const newIndex = listsQuery.data.findIndex((i) => i.id === over?.id);

    const newData = arrayMove(listsQuery.data, oldIndex, newIndex);
    reorderLists.mutate(newData);
  }

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold">Lists</span>
        <Button size="sm" variant="linkMuted" onClick={() => addList.mutate()}>
          <Plus size="1rem" className="mr-2" />
          Add List
        </Button>
      </header>
      <Card
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden py-2 transition-colors",
          activeList && "border-primary",
        )}
      >
        {listsQuery.isLoading && <Loader />}
        {listsQuery.isError && <Error error={listsQuery.error} />}
        {listsQuery.isSuccess && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext
              id="packing-lists"
              items={listsQuery.data}
              strategy={verticalListSortingStrategy}
            >
              {listsQuery.data?.map((list) => (
                <PackingList key={list.id} list={list} />
              ))}
            </SortableContext>
            <DragOverlay dropAnimation={null}>
              {activeList && <PackingList list={activeList} isOverlay />}
            </DragOverlay>
          </DndContext>
        )}
        {listsQuery.isSuccess && listsQuery.data.length === 0 && (
          <Placeholder message="No lists yet" />
        )}
      </Card>
    </div>
  );
}
