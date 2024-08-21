import { api } from "@/app/lib/client";
import useListId from "./use-list-id";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type Updater,
} from "@tanstack/react-query";
import {
  itemsQueryOptions,
  listQueryOptions,
  listsQueryOptions,
} from "../lib/queries";
import { toast } from "sonner";
import type { CategoryItem, Item, List } from "astro:db";
import {
  type ExpandedList,
  type ExpandedCategory,
  type ExpandedCategoryItem,
} from "@/api/lib/types";
import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { produce } from "immer";
import { initCategory, initCategoryItem, initItem } from "../lib/init";

import { v4 as uuid } from "uuid";

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

  const onMutateMessage = (message: string) => {
    toastId.current = toast.loading(message);
  };

  const toastSuccess = (message: string) => {
    toast.success(message, { id: toastId.current });
  };

  async function optimisticUpdate<T extends object>(
    queryKey: QueryKey,
    updater: Updater<T, T>,
  ): Promise<{ previous: T | null | undefined }> {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData<T>(queryKey);
    queryClient.setQueryData<T>(queryKey, (prev) => {
      if (!prev) return prev;
      if (typeof updater === "function") {
        return updater(prev);
      }
      return updater;
    });
    return { previous };
  }

  function onErrorOptimistic<T extends object>(
    queryKey: QueryKey,
    context: { previous: T | null | undefined } | undefined,
  ) {
    if (context?.previous) {
      queryClient.setQueryData(queryKey, context.previous);
    }
  }

  const deleteCategoryItem = useMutation({
    mutationFn: async (props: {
      categoryId: string;
      categoryItemId: string;
    }) => {
      const { categoryId, categoryItemId } = props;
      const res = await api.lists[":listId"].categories[":categoryId"][
        "category-items"
      ][":categoryItemId"].$delete({
        param: { listId, categoryId, categoryItemId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onMutate: ({ categoryId, categoryItemId }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const categoryIdx = draft.categories.findIndex(
            (i) => i.id === categoryId,
          );
          if (categoryIdx === -1) return draft;
          const newItems = draft.categories[categoryIdx].items.filter(
            (i) => i.id !== categoryItemId,
          );
          draft.categories[categoryIdx].items = newItems;
        }),
      );
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (props: { categoryId: string; categoryName: string }) => {
      const { categoryId } = props;
      const res = await api.lists[":listId"].categories[":categoryId"].$delete({
        param: { categoryId, listId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onMutate: ({ categoryId }) => {
      onMutateMessage("Deleting category...");
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.filter((i) => i.id !== categoryId),
      }));
    },
    onSuccess: (_, { categoryName }) => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
      toastSuccess(`${categoryName || "Unnamed"} category deleted`);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const deleteList = useMutation({
    mutationFn: async (props: { listId: string }) => {
      const { listId } = props;
      const res = await api.lists[":listId"].$delete({
        param: { listId },
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
    onMutate: () => onMutateMessage("Deleting list..."),
    onError,
  });

  const updateItem = useMutation({
    mutationFn: async (props: {
      itemId: string;
      data: Partial<typeof Item.$inferInsert>;
    }) => {
      const { itemId, data } = props;
      const res = await api.items[":itemId"].$patch({
        json: data,
        param: { itemId },
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
      categoryId: string;
      categoryItemId: string;
      data: Partial<typeof CategoryItem.$inferInsert>;
    }) => {
      const { categoryId, categoryItemId } = props;
      const res = await api.lists[":listId"].categories[":categoryId"][
        "category-items"
      ][":categoryItemId"].$patch({
        param: { categoryId, categoryItemId, listId },
        json: props.data,
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
      const { categoryId } = props;
      const res = await api.lists[":listId"].categories[":categoryId"].$patch({
        param: { categoryId, listId },
        json: props.data,
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  const addCategoryItem = useMutation({
    mutationFn: async (props: { categoryId: string }) => {
      const { categoryId } = props;
      const res = await api.lists[":listId"].categories[":categoryId"][
        "category-items"
      ].$post({
        param: { listId, categoryId },
        json: {},
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onMutate: async ({ categoryId }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const categoryIdx = draft.categories.findIndex(
            (i) => i.id === categoryId,
          );
          if (categoryIdx === -1) return draft;
          // TODO - fix issue with mismatched Ids
          const item = initItem();
          const categoryItem = initCategoryItem({ itemData: item, categoryId });
          draft.categories[categoryIdx].items.push(categoryItem);
        }),
      );
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
  });

  const addItemToCategory = useMutation({
    mutationFn: async (props: {
      categoryId: string;
      itemId: string;
      categoryItemId: string;
      categoryItems: ExpandedCategoryItem[];
    }) => {
      const { categoryId, itemId, categoryItemId, categoryItems } = props;
      const res = await api.lists[":listId"].categories[":categoryId"][
        "category-items"
      ].$post({
        param: { listId, categoryId },
        json: {
          itemId,
          categoryItemId,
          categoryItemIds: categoryItems.map((i) => i.id),
        },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onMutate: async ({ categoryId, itemId, categoryItems }) => {
      const { queryKey } = listQueryOptions(listId);
      const item = queryClient
        .getQueryData(itemsQueryOptions.queryKey)
        ?.find((i) => i.id === itemId);
      if (!item) return;
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const categoryIdx = draft.categories.findIndex(
            (i) => i.id === categoryId,
          );
          if (categoryIdx === -1) return draft;
          draft.categories[categoryIdx].items = categoryItems;
        }),
      );
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const newCategoryId = React.useRef<string | null>(null);
  const addCategory = useMutation({
    mutationFn: () => {
      newCategoryId.current = uuid();
      return api.lists[":listId"].categories.$post({
        param: { listId },
        json: { categoryId: newCategoryId.current },
      });
    },
    onMutate: () => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const newCategory = initCategory();
          if (newCategoryId.current) {
            newCategory.id = newCategoryId.current;
          }
          draft.categories.push(newCategory);
        }),
      );
    },
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const toggleCategoryPacked = useMutation({
    mutationFn: async (props: { categoryId: string }) => {
      const { categoryId } = props;
      const res = await api.lists[":listId"].categories[":categoryId"][
        "toggle-packed"
      ].$post({
        param: { categoryId, listId },
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
      const res = await api.items[":itemId"].$delete({
        param: { itemId: props.itemId },
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
    onMutate: () => onMutateMessage("Deleting item..."),
    onError,
  });

  const updateList = useMutation({
    mutationFn: async (props: { data: Partial<typeof List.$inferInsert> }) => {
      const res = await api.lists[":listId"].$patch({
        json: props.data,
        param: { listId },
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

  const duplicateList = useMutation({
    mutationFn: async (props: { listId: string }) => {
      const { listId } = props;
      const res = await api.lists[":listId"].duplicate.$post({
        param: { listId },
      });
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
      return optimisticUpdate(listsQueryOptions.queryKey, newLists);
    },
    onError: (error, __, context) => {
      const { queryKey } = listsQueryOptions;
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
    onSuccess: () => {
      const { queryKey } = listsQueryOptions;
      invalidateQueries([queryKey]);
    },
  });

  const reorderCategories = useMutation({
    mutationFn: (categories: ExpandedCategory[]) =>
      api.lists[":listId"].categories.reorder.$put({
        param: { listId },
        json: categories.map((i) => i.id),
      }),
    onMutate: async (newCategories) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: newCategories,
      }));
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
    onSuccess: () => {
      const { queryKey } = listQueryOptions(listId);
      invalidateQueries([queryKey]);
    },
  });

  const reorderCategoryItems = useMutation({
    mutationFn: async (props: {
      categoryId: string;
      categoryItems: ExpandedCategoryItem[];
    }) => {
      const { categoryId, categoryItems } = props;
      const res = await api.lists[":listId"].categories[":categoryId"][
        "category-items"
      ].reorder.$put({
        param: { listId, categoryId },
        json: categoryItems.map((i) => i.id),
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onMutate: async ({ categoryId, categoryItems }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.map((category) =>
          category.id === categoryId
            ? { ...category, items: categoryItems }
            : {
                ...category,
                items: category.items.filter(
                  (i) => !categoryItems.map((i) => i.id).includes(i.id),
                ),
              },
        ),
      }));
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
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
    addCategoryItem,
    addItemToCategory,
    addList,
    duplicateList,
    addCategory,
    reorderLists,
    reorderCategories,
    reorderCategoryItems,
    toggleCategoryPacked,
  };
}
