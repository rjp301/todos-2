import { api } from "@/lib/client";
import useListId from "./useListId";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { itemsQueryOptions, listQueryOptions } from "../lib/queries";
import { toast } from "sonner";

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

  return { deleteCategoryItem, deleteCategory };
}
