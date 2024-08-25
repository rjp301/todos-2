import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/app/components/app-header";
import Error from "@/app/components/base/error";
import Loader from "@/app/components/base/loader";
import ServerInput from "@/app/components/input/server-input";
import ListSettings from "@/app/components/list-settings";
import { cn } from "@/app/lib/utils";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ServerTextarea from "@/app/components/input/server-textarea";
import useListId from "@/app/hooks/use-list-id";
import { listQueryOptions } from "../lib/queries";
import useMutations from "../hooks/use-mutations";
import ListCategories from "../components/list-categories/list-categories";

function ListPage(): ReturnType<React.FC> {
  const listId = useListId();
  const listQuery = useQuery(listQueryOptions(listId));

  const { updateList } = useMutations();

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
            className="text-lg font-bold"
            onUpdate={(v) => updateList.mutate({ listId, data: { name: v } })}
            inline
          />
        </h1>
        <ListSettings list={listQuery.data} />
      </AppHeader>
      <section className="container2 flex-1 overflow-auto">
        <div className="flex flex-col gap-4 py-4 pb-20">
          <ServerTextarea
            key={listQuery.data.id}
            className="bg-card"
            placeholder="List Description"
            currentValue={listQuery.data.description ?? ""}
            onUpdate={(v) =>
              updateList.mutate({ listId, data: { description: v } })
            }
          />

          <ListCategories categories={listQuery.data.categories} />
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/_app/list/$listId")({
  component: ListPage,
});
