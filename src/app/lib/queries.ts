import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: () => actions.getLists.orThrow(),
});

export const listQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["lists", listId],
    queryFn: () => actions.getList.orThrow({ listId }),
  });

export const otherListCategoriesQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["other-categories", listId],
    queryFn: () => actions.getOtherListCategories.orThrow({ listId }),
  });

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  staleTime: 1000 * 60 * 5,
  queryFn: () => actions.getMe.orThrow(),
});

export const itemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: () => actions.getItems.orThrow(),
});
