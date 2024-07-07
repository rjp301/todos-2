import { api } from "@/app/lib/client";
import useListId from "./use-list-id";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import {
  itemsQueryOptions,
  listQueryOptions,
  listsQueryOptions,
} from "../lib/queries";
import { toast } from "sonner";
import type { CategoryItem, Item, List } from "astro:db";
import type { ExpandedCategory } from "@/api/lib/types";
import React from "react";
import { useNavigate } from "@tanstack/react-router";

export default function useMutations() {
  const listId = useListId();
  const queryClient = useQueryClient();
  const toastId = React.useRef<string | number | undefined>();
  const navigate = useNavigate();

  const invalidateQueries = (queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    );
  };

  const onError = (error: Error) => {
    console.error(error);
    toast.error(error.message, { id: toastId.current });
  };

  const onMutateMessage = (message: string) => () => {
    toastId.current = toast.loading(message);
  };

  const toastSuccess = (message: string) => {
    toast.success(message, { id: toastId.current });
  };

  const deleteCategoryItem = useMutation({
    mutationFn: async (props: { categoryItemId: string }) => {
      const res = await api["categories-items"].delete.$post({
        json: { id: props.categoryItemId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError,
  });

  const deleteCategory = useMutation({
    mutationFn: async (props: { categoryId: string; categoryName: string }) => {
      const res = await api.categories[":id"].$delete({
        param: { id: props.categoryId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: (_, { categoryName }) => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
      toastSuccess(`${categoryName || "Unnamed"} category deleted`);
    },
    onMutate: onMutateMessage("Deleting category..."),
    onError,
  });

  const deleteList = useMutation({
    mutationFn: async (props: { listId: string }) => {
      const res = await api.lists[":id"].$delete({
        param: { id: props.listId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: (_, props) => {
      queryClient.invalidateQueries({ queryKey: listsQueryOptions.queryKey });
      toastSuccess("List deleted successfully");
      if (props.listId === listId) {
        navigate({ to: "/" });
      }
    },
    onMutate: onMutateMessage("Deleting list..."),
    onError,
  });

  const updateItem = useMutation({
    mutationFn: async (props: {
      itemId: string;
      data: Partial<typeof Item.$inferInsert>;
    }) => {
      const { itemId: id, data } = props;
      const res = await api.items[":id"].$patch({
        json: data,
        param: { id },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError,
  });

  const updateCategoryItem = useMutation({
    mutationFn: async (props: {
      categoryItemId: string;
      data: Partial<typeof CategoryItem.$inferInsert>;
    }) => {
      const res = await api["categories-items"].update.$post({
        json: { id: props.categoryItemId, value: props.data },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  const updateCategory = useMutation({
    mutationFn: async (props: {
      categoryId: string;
      data: Partial<ExpandedCategory>;
    }) => {
      const res = await api.categories[":id"].$patch({
        param: { id: props.categoryId },
        json: props.data,
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  const addItemToCategory = useMutation({
    mutationFn: async (props: { categoryId: string }) => {
      const res = await api["categories-items"].$post({
        json: { categoryId: props.categoryId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError,
  });

  const addCategory = useMutation({
    mutationFn: () => api.categories.$post({ json: { listId } }),
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  const toggleCategoryPacked = useMutation({
    mutationFn: async (props: { categoryId: string }) => {
      const res = await api.categories[":id"]["toggle-packed"].$post({
        param: { id: props.categoryId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  const deleteItem = useMutation({
    mutationFn: async (props: { itemId: string; itemName: string }) => {
      const res = await api.items[":id"].$delete({
        param: { id: props.itemId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: (_, props) => {
      invalidateQueries([
        itemsQueryOptions.queryKey,
        listQueryOptions(listId).queryKey,
      ]);
      toastSuccess(`${props.itemName || "Unnamed gear"} deleted`);
    },
    onMutate: onMutateMessage("Deleting item..."),
    onError,
  });

  const updateList = useMutation({
    mutationFn: async (props: { data: Partial<typeof List.$inferInsert> }) => {
      const res = await api.lists[":id"].$patch({
        json: props.data,
        param: { id: listId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        listsQueryOptions.queryKey,
      ]);
    },
    onError,
  });

  const addList = useMutation({
    mutationFn: async () => {
      const res = await api.lists.$post();
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    },
    onSuccess: (data) => {
      const { queryKey } = listsQueryOptions;
      queryClient.invalidateQueries({ queryKey });
      navigate({ to: "/list/$listId", params: { listId: data.id } });
    },
    onError,
  });

  const reorderLists = useMutation({
    mutationFn: (lists: (typeof List.$inferSelect)[]) =>
      api.lists.reorder.$put({ json: lists.map((i) => i.id) }),
    onMutate: async (newLists) => {
      const { queryKey } = listsQueryOptions;
      await queryClient.cancelQueries({ queryKey });
      const previousLists = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, newLists);
      return { previousLists };
    },
    onError: (error, __, context) => {
      const { queryKey } = listsQueryOptions;
      if (context?.previousLists)
        queryClient.setQueryData(queryKey, context.previousLists);
      onError(error);
    },
    onSuccess: () => {
      const { queryKey } = listsQueryOptions;
      invalidateQueries([queryKey]);
    },
  });

  const reorderCategories = useMutation({
    mutationFn: (categories: ExpandedCategory[]) =>
      api.categories.reorder.$put({ json: categories.map((i) => i.id) }),
    onMutate: async (newCategories) => {
      const { queryKey } = listQueryOptions(listId);
      const previousList = queryClient.getQueryData(queryKey);
      if (!previousList) return { previousList };

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(queryKey, {
        ...previousList,
        categories: newCategories,
      });
      return { previousList };
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      if (context?.previousList)
        queryClient.setQueryData(queryKey, context.previousList);
      onError(error);
    },
    onSuccess: () => {
      const { queryKey } = listQueryOptions(listId);
      invalidateQueries([queryKey]);
    },
  });

  return {
    deleteCategoryItem,
    deleteCategory,
    deleteItem,
    deleteList,
    updateCategoryItem,
    updateItem,
    updateList,
    updateCategory,
    addItemToCategory,
    addList,
    addCategory,
    reorderLists,
    reorderCategories,
    toggleCategoryPacked,
  };
}
