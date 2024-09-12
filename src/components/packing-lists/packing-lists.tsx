import { Plus } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import PackingList from "./packing-list";
import { cn } from "@/lib/utils";
import { listsQueryOptions } from "@/lib/queries";
import useMutations from "@/hooks/use-mutations";

import ArrayQueryGuard from "../base/array-query-guard";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { ListSelect } from "@/lib/types";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { flushSync } from "react-dom";
import { z } from "zod";
import { DndEntityType, isDndEntityType } from "@/lib/constants";
import SidebarSectionHeader from "../sidebar/sidebar-section-header";
import useScrollShadow from "@/hooks/use-scroll-shadow";
import { useVirtualizer } from "@tanstack/react-virtual";
import useCurrentList from "@/hooks/use-current-list";

export default function PackingLists(): ReturnType<React.FC> {
  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];
  const { addList, reorderLists } = useMutations();

  React.useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isDndEntityType(source.data, DndEntityType.List);
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
      },
    });
  }, [lists]);

  const { listRef, isScrolled } = useScrollShadow();

  const rowVirtualizer = useVirtualizer({
    count: lists.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 36,
    scrollPaddingEnd: 32,
    scrollPaddingStart: 32,
  });

  const { listId } = useCurrentList();
  React.useEffect(() => {
    if (!listId) return;
    const index = lists.findIndex((list) => list.id === listId);
    if (index < 0) return;
    rowVirtualizer.scrollToIndex(index, { behavior: "smooth" });
  }, [listId, lists.length]);

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn("px-4 py-2 transition-shadow", isScrolled && "shadow")}
      >
        <SidebarSectionHeader
          title="Lists"
          action={{
            children: (
              <>
                <Plus size="1rem" className="mr-2" />
                <span>Add List</span>
              </>
            ),
            onClick: () => addList.mutate({}),
          }}
        />
      </div>
      <div
        ref={listRef}
        className={cn("h-full overflow-y-auto overflow-x-hidden py-1")}
      >
        <ArrayQueryGuard query={listsQuery} placeholder="No lists yet">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <PackingList list={lists[virtualItem.index]} />
              </div>
            ))}
          </div>
        </ArrayQueryGuard>
      </div>
    </div>
  );
}
