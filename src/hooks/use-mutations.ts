import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  itemsQueryOptions,
  listQueryOptions,
  listsQueryOptions,
  otherListCategoriesQueryOptions,
} from "@/lib/queries";
import {
  type ExpandedList,
  type ExpandedCategory,
  type ExpandedCategoryItem,
  type ListSelect,
} from "@/lib/types";
import { produce } from "immer";
import { initCategory, initCategoryItem, initItem } from "@/lib/init";
import { actions } from "astro:actions";
import { useNavigate } from "react-router-dom";
import useCurrentList from "./use-current-list";
import useMutationHelpers from "./use-mutation-helpers";

export default function useMutations() {
  const { listId } = useCurrentList();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    onError,
    onMutateMessage,
    toastSuccess,
    optimisticUpdate,
    onErrorOptimistic,
    invalidateQueries,
  } = useMutationHelpers();

  const deleteCategoryItem = useMutation({
    mutationFn: actions.deleteCategoryItem.orThrow,
    onMutate: ({ categoryItemId }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          draft.categories.forEach((category) => {
            category.items = category.items.filter(
              (i) => i.id !== categoryItemId,
            );
          });
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
    mutationFn: actions.deleteCategory.orThrow,
    onMutate: ({ categoryId }) => {
      onMutateMessage("Deleting category...");
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.filter((i) => i.id !== categoryId),
      }));
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      toastSuccess(`Category deleted`);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const deleteList = useMutation({
    mutationFn: actions.deleteList.orThrow,
    onSuccess: (_, props) => {
      invalidateQueries([
        listsQueryOptions.queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      toastSuccess("List deleted successfully");
      if (props.listId === listId) {
        navigate("/");
      }
    },
    onMutate: () => onMutateMessage("Deleting list..."),
    onError,
  });

  const updateItem = useMutation({
    mutationFn: actions.updateItem.orThrow,
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError,
  });

  const updateCategoryItem = useMutation({
    mutationFn: actions.updateCategoryItem.orThrow,
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onMutate: ({ categoryItemId, data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.id === categoryItemId ? { ...item, ...data } : item,
          ),
        })),
      }));
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const updateCategory = useMutation({
    mutationFn: actions.updateCategory.orThrow,
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
    onError,
  });

  const addCategoryItem = useMutation({
    mutationFn: actions.createNewItemAndAddToCategory.orThrow,
    onMutate: async ({ categoryId, itemData, data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const categoryIdx = draft.categories.findIndex(
            (i) => i.id === categoryId,
          );
          if (categoryIdx === -1) return draft;
          // TODO - fix issue with mismatched Ids
          const item = initItem(itemData);
          const categoryItem = initCategoryItem({
            itemData: item,
            categoryId,
            ...data,
          });
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
    mutationFn: (props: {
      itemId: string;
      categoryId: string;
      data?: Partial<ExpandedCategoryItem>;
      categoryItems: ExpandedCategoryItem[];
    }) =>
      actions.addItemToCategory.orThrow({
        ...props,
        reorderIds: props.categoryItems.map((i) => i.id),
      }),
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
        otherListCategoriesQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const addItem = useMutation({
    mutationFn: actions.createItem.orThrow,
    onSuccess: () => {
      invalidateQueries([itemsQueryOptions.queryKey]);
    },
    onError,
  });

  const addCategory = useMutation({
    mutationFn: actions.createCategory.orThrow,
    onMutate: ({ data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const newCategory = initCategory(data);
          draft.categories.push(newCategory);
        }),
      );
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const toggleCategoryPacked = useMutation({
    mutationFn: actions.toggleCategoryPacked.orThrow,
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  const copyCategoryToList = useMutation({
    mutationFn: actions.copyCategoryToList.orThrow,
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
    onError,
  });

  const deleteItem = useMutation({
    mutationFn: actions.deleteItem.orThrow,
    onSuccess: () => {
      invalidateQueries([
        itemsQueryOptions.queryKey,
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      toastSuccess(`Gear has been deleted`);
    },
    onMutate: () => onMutateMessage("Deleting item..."),
    onError,
  });

  const updateList = useMutation({
    mutationFn: actions.updateList.orThrow,
    onMutate: ({ data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        ...data,
      }));
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
        listsQueryOptions.queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const addList = useMutation({
    mutationFn: actions.createList.orThrow,
    onSuccess: (data) => {
      invalidateQueries([
        listsQueryOptions.queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      navigate(`/list/${data.id}`);
    },
    onError,
  });

  const duplicateList = useMutation({
    mutationFn: actions.duplicateList.orThrow,
    onSuccess: (data) => {
      invalidateQueries([
        listsQueryOptions.queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      navigate(`/list/${data.listId}`);
    },
    onError,
  });

  const duplicateItem = useMutation({
    mutationFn: actions.duplicateItem.orThrow,
    onSuccess: () => {
      const { queryKey } = itemsQueryOptions;
      queryClient.invalidateQueries({ queryKey });
    },
    onError,
  });

  const reorderLists = useMutation({
    mutationFn: (lists: ListSelect[]) =>
      actions.reorderLists.orThrow(lists.map((i) => i.id)),
    onMutate: async (newLists) => {
      return optimisticUpdate(listsQueryOptions.queryKey, newLists);
    },
    onError: (error, __, context) => {
      const { queryKey } = listsQueryOptions;
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
    onSuccess: () => {
      invalidateQueries([
        listsQueryOptions.queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
  });

  const reorderCategories = useMutation({
    mutationFn: (categories: ExpandedCategory[]) =>
      actions.reorderCategories.orThrow({
        listId,
        ids: categories.map((i) => i.id),
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
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
  });

  const reorderCategoryItems = useMutation({
    mutationFn: (props: {
      categoryId: string;
      categoryItems: ExpandedCategoryItem[];
    }) =>
      actions.reorderCategoryItems.orThrow({
        ...props,
        ids: props.categoryItems.map((i) => i.id),
      }),
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

  const unpackList = useMutation({
    mutationFn: actions.unpackList.orThrow,
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onError,
  });

  const addFeedback = useMutation({
    mutationFn: actions.addFeedback.orThrow,
    onSuccess: () => {
      toastSuccess("Feedback submitted");
    },
    onError,
  });

  const deleteUser = useMutation({
    mutationFn: actions.deleteUser.orThrow,
    onSuccess: () => {
      window.location.reload();
    },
    onError,
  });

  return {
    deleteCategoryItem,
    deleteCategory,
    deleteItem,
    deleteList,
    deleteUser,
    updateCategoryItem,
    updateItem,
    updateList,
    updateCategory,
    addCategoryItem,
    addItemToCategory,
    addList,
    addItem,
    duplicateItem,
    duplicateList,
    addCategory,
    reorderLists,
    reorderCategories,
    reorderCategoryItems,
    toggleCategoryPacked,
    copyCategoryToList,
    unpackList,
    addFeedback,
  };
}
