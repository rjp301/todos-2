import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: () => actions.getLists().then((res) => res.data),
});

export const listQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["lists", listId],
    queryFn: () => actions.getList({ listId }).then((res) => res.data),
  });

export const otherListCategoriesQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["other-categories", listId],
    queryFn: () =>
      actions.getOtherListCategories({ listId }).then((res) => res.data),
  });

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  staleTime: 1000 * 60 * 5,
  queryFn: () => actions.getMe().then((res) => res.data),
});

export const itemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: () => actions.getItems().then((res) => res.data),
});
