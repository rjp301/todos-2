import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/app/components/app-header";
import Error from "@/app/components/base/error";
import Loader from "@/app/components/base/loader";
import ServerInput from "@/app/components/input/server-input";
import ListSettings from "@/app/components/list-settings";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { Plus } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ServerTextarea from "@/app/components/input/server-textarea";
import useListId from "@/app/hooks/useListId";
import { listQueryOptions } from "../lib/queries";
import useMutations from "../hooks/useMutations";
import ListCategories from "../components/list-category/list-categories";

function ListPage(): ReturnType<React.FC> {
  const listId = useListId();
  const listQuery = useQuery(listQueryOptions(listId));

  const { updateList, addCategory } = useMutations();

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
            onUpdate={(v) => updateList.mutate({ data: { name: v } })}
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
            onUpdate={(v) => updateList.mutate({ data: { description: v } })}
          />

          <ListCategories categories={listQuery.data.categories} />

          <Button
            variant="linkMuted"
            size="sm"
            className="ml-2 w-min"
            onClick={() => addCategory.mutate()}
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
