import type { ExpandedList } from "@/api/lib/types";
import useListId from "./use-list-id";
import { listQueryOptions } from "../lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function useCurrentList(): {
  list: ExpandedList | undefined;
  listItemIds: string[];
} {
  const listId = useListId();
  const queryClient = useQueryClient();
  const list = queryClient.getQueryData<ExpandedList>(
    listQueryOptions(listId).queryKey,
  );

  const listItemIds = React.useMemo(
    () =>
      list?.categories.flatMap((category) =>
        category.items.map((item) => item.id),
      ) ?? [],
    [list],
  );

  return { list, listItemIds };
}
