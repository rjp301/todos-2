import { api } from "@/lib/client";
import useListId from "./useListId";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { itemsQueryOptions, listQueryOptions } from "../lib/queries";
import { toast } from "sonner";
import type { CategoryItem, Item } from "astro:db";
import type { ExpandedCategory } from "@/api/lib/types";

const onError = (error: Error) => {
  console.error(error);
  toast.error(error.message);
};

export default function useMutations() {
  const listId = useListId();
  const queryClient = useQueryClient();

  const invalidateQueries = (queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    );
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
      const res = await api.categories.delete.$post({
        json: { id: props.categoryId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: (_, { categoryName }) => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
      toast.success(`${categoryName || "Unnamed"} category deleted`);
    },
    onError,
  });

  const updateItem = useMutation({
    mutationFn: async (props: {
      itemId: string;
      data: Partial<typeof Item.$inferInsert>;
    }) => {
      const res = await api.items.update.$post({
        json: { id: props.itemId, value: props.data },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  const updateCategoryItem = useMutation({
    mutationFn: (props: {
      categoryItemId: string;
      data: Partial<typeof CategoryItem.$inferInsert>;
    }) =>
      api["categories-items"].update.$post({
        json: { id: props.categoryItemId, value: props.data },
      }),
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
      const res = await api.categories.update.$post({
        json: { id: props.categoryId, value: props.data },
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

  const toggleCategoryPacked = useMutation({
    mutationFn: async (props: { categoryId: string }) => {
      const res = await api.categories["toggle-packed"].$post({
        json: { id: props.categoryId },
      });
      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  return {
    deleteCategoryItem,
    deleteCategory,
    updateCategoryItem,
    updateItem,
    updateCategory,
    addItemToCategory,
    toggleCategoryPacked,
  };
}
