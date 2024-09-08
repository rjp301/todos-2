import type { ExpandedList } from "@/lib/types";
import { listQueryOptions } from "../lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function useCurrentList(): {
  listId: string;
  list: ExpandedList | undefined | null;
  listItemIds: Set<string>;
} {
  const params = useParams();
  const listId = params.listId ?? "";

  const { data: list } = useQuery(listQueryOptions(listId));

  const listItemIds = new Set(
    list?.categories.flatMap((category) =>
      category.items.map((item) => item.itemData.id),
    ) ?? [],
  );

  return { list, listItemIds, listId };
}
