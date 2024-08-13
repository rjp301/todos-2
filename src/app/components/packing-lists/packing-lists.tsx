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

export default function PackingLists(): ReturnType<React.FC> {
  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];
  const { addList, reorderLists } = useMutations();

  React.useEffect(() => {
    return monitorForElements({});
  }, [lists]);

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
