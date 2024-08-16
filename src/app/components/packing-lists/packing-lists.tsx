import { Plus } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import PackingList from "./packing-list";
import { cn } from "@/app/lib/utils";
import { listsQueryOptions } from "@/app/lib/queries.ts";
import useMutations from "@/app/hooks/use-mutations";

import ArrayQueryGuard from "../base/array-query-guard";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { isEntity } from "@/app/lib/validators";
import type { ListSelect } from "@/api/lib/types";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import { flushSync } from "react-dom";
import { z } from "zod";

export default function PackingLists(): ReturnType<React.FC> {
  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];
  const { addList, reorderLists } = useMutations();

  React.useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isEntity<ListSelect>(source.data);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = z.custom<ListSelect>().safeParse(source.data);
        const targetData = z.custom<ListSelect>().safeParse(target.data);

        if (!sourceData.success || !targetData.success) {
          return;
        }

        const indexOfSource = lists.findIndex(
          (list) => list.id === sourceData.data.id,
        );
        const indexOfTarget = lists.findIndex(
          (list) => list.id === targetData.data.id,
        );

        if (indexOfTarget < 0 || indexOfSource < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(target.data);
        
        // Using `flushSync` so we can query the DOM straight after this line
        flushSync(() => {
          reorderLists.mutate(
            reorderWithEdge({
              list: lists,
              startIndex: indexOfSource,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "vertical",
            }),
          );
        });
        // Being simple and just querying for the task after the drop.
        // We could use react context to register the element in a lookup,
        // and then we could retrieve that element after the drop and use
        // `triggerPostMoveFlash`. But this gets the job done.
        const element = document.querySelector(
          `[data-list-id="${sourceData.data.id}"]`,
        );
        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }
      },
    });
  }, [lists]);

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <header className="flex items-center justify-between">
        <span className="text-base font-semibold">Lists</span>
        <Button size="sm" variant="linkMuted" onClick={() => addList.mutate()}>
          <Plus size="1rem" className="mr-2" />
          Add List
        </Button>
      </header>
      <Card
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden py-2 transition-colors",
          // draggingId && "border-primary",
        )}
      >
        <ArrayQueryGuard query={listsQuery} placeholder="No lists">
          {lists.map((list) => (
            <PackingList key={list.id} list={list} />
          ))}
        </ArrayQueryGuard>
      </Card>
    </div>
  );
}
