import type { ExpandedList } from "@/api/lib/types";
import useListId from "./use-list-id";
import { listQueryOptions } from "../lib/queries";
import { useQuery } from "@tanstack/react-query";

export default function useCurrentList(): {
  list: ExpandedList | undefined | null;
  listItemIds: Set<string>;
} {
  const listId = useListId();
  const { data: list } = useQuery(listQueryOptions(listId));

  const listItemIds = new Set(
    list?.categories.flatMap((category) =>
      category.items.map((item) => item.itemData.id),
    ) ?? [],
  );

  return { list, listItemIds };
}
