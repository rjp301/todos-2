import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/components/app-header";
import Error from "@/components/base/error";
import Loader from "@/components/base/loader";
import ServerInput from "@/components/input/server-input";
import ListSettings from "@/app/components/list-settings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ServerTextarea from "@/components/input/server-textarea";
import ListCategory from "@/components/list-category/list-category";
import useListId from "@/app/hooks/useListId";
import { listQueryOptions, listsQueryOptions } from "../lib/queries";
import type { ListInsert } from "@/api/db/schema";
import { api } from "@/lib/client";

function ListPage(): ReturnType<React.FC> {
  const listId = useListId();
  const queryClient = useQueryClient();

  const listQuery = useQuery(listQueryOptions(listId));

  const updateListMutation = useMutation({
    mutationFn: (data: Partial<ListInsert>) =>
      api.lists.update.$post({ json: { id: listId, value: data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listQueryOptions(listId).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: listsQueryOptions.queryKey });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: () => api.categories.$post({ json: { listId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listQueryOptions(listId).queryKey,
      });
    },
  });

  if (listQuery.isLoading)
    return (
      <div className="h-full">
        <AppHeader />
        <Loader />
      </div>
    );

  if (listQuery.isError || !listQuery.data)
    return (
      <div className="h-full">
        <AppHeader />
        <Error error={listQuery.error} showGoHome />
      </div>
    );

  return (
    <div className="flex h-full flex-col">
      <AppHeader>
        <h1 className={cn("flex-1 text-lg font-bold")}>
          <ServerInput
            key={listQuery.data.id}
            currentValue={listQuery.data.name ?? ""}
            placeholder="Unnamed List"
            className="w-full border-none bg-transparent text-lg font-bold shadow-none placeholder:italic"
            onUpdate={(v) => updateListMutation.mutate({ name: v })}
          />
        </h1>
        <ListSettings list={listQuery.data} />
      </AppHeader>
      <section className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          <ServerTextarea
            key={listQuery.data.id}
            className="bg-card"
            placeholder="List Description"
            currentValue={listQuery.data.description ?? ""}
            onUpdate={(v) => updateListMutation.mutate({ description: v })}
          />

          {listQuery.data.categories.map((category) => (
            <ListCategory key={category.id} category={category} />
          ))}

          <Button
            variant="linkMuted"
            size="sm"
            className="ml-2 w-min"
            onClick={() => createCategoryMutation.mutate()}
          >
            <Plus size="1rem" className="mr-2" />
            Add Category
          </Button>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/_app/list/$listId")({
  component: ListPage,
});
