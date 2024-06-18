import { Plus } from "lucide-react";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import PackingList from "./packing-list";
import Loader from "../base/loader";
import Error from "../base/error";

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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import Placeholder from "../base/placeholder";
import { useNavigate } from "@tanstack/react-router";
import type { List } from "@/api/db/schema.ts";
import { listsQueryOptions } from "@/app/lib/queries.ts";
import { api } from "@/lib/client";

export default function PackingLists(): ReturnType<React.FC> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeList, setActiveList] = React.useState<List | null>(null);

  const listsQuery = useQuery(listsQueryOptions);
  const { queryKey } = listsQueryOptions;

  const newListMutation = useMutation({
    mutationFn: async () => {
      const response = await api.lists.$post();
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      navigate({ to: "/list/$listId", params: { listId: data.id } });
    },
  });

  const reorderListsMutation = useMutation({
    mutationFn: (lists: List[]) =>
      api.lists.reorder.$post({ json: lists.map((i) => i.id) }),
    onMutate: async (newLists) => {
      await queryClient.cancelQueries({ queryKey });
      const previousLists = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, newLists);
      return { previousLists };
    },
    onError: (_, __, context) => {
      if (context?.previousLists)
        queryClient.setQueryData(queryKey, context.previousLists);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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
    reorderListsMutation.mutate(newData);
  }

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold">Lists</span>
        <Button
          size="sm"
          variant="linkMuted"
          onClick={() => newListMutation.mutate()}
        >
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
