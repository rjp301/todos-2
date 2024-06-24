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
      queryClient.invalidateQueries({
        queryKey: listQueryOptions(listId).queryKey,
      });
    },
    onError,
  });

  return { deleteCategoryItem, deleteCategory, updateCategoryItem, updateItem };
}
