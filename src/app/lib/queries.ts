import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: async () => {
    const res = await api.lists.$get();
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});

export const listQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["lists", listId],
    queryFn: async () => {
      const res = await api.lists[":id"].$get({ param: { id: listId } });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const res = await api.auth.me.$get();
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});

export const itemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: async () => {
    const res = await api.items.$get();
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});
