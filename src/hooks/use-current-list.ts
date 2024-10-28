import type { ExpandedList } from "@/lib/types";
import { listQueryOptions } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import React from "react";

const getItemsIds = (list: ExpandedList | undefined) => {
  if (!list) return [];
  return list.categories.flatMap((category) =>
    category.items.map((item) => item.itemData.id),
  );
};

export default function useCurrentList(): {
  listId: string;
  list: ExpandedList | undefined;
  listItemIds: Set<string>;
  duplicateListItemIds: Set<string>;
} {
  const params = useParams();
  const listId = params.listId ?? "";

  const { data: list } = useQuery(listQueryOptions(listId));

  const listItemIds = new Set(getItemsIds(list));

  const duplicateListItemIds = React.useMemo(() => {
    const itemIds = getItemsIds(list);
    const duplicateIds = new Set<string>();
    const seen = new Set<string>();
    for (const id of itemIds) {
      if (seen.has(id)) {
        duplicateIds.add(id);
      } else {
        seen.add(id);
      }
    }
    return duplicateIds;
  }, [list]);

  return { list, listItemIds, duplicateListItemIds, listId };
}
