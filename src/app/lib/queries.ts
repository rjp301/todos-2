import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";
import { actions } from "astro:actions";

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: async () => {
    const res = await api.lists.$get();
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  },
});

export const listQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["lists", listId],
    queryFn: async () => {
      if (!listId) return null;
      const res = await api.lists[":listId"].$get({ param: { listId } });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    },
  });

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: async () => {
    const res = await api.auth.me.$get();
    if (!res.ok) return null;
    return await res.json();
  },
});

export const itemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: () => actions.getItems().then((res) => res.data),
});
