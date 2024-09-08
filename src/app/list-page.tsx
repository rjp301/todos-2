import { useQuery } from "@tanstack/react-query";
import React from "react";
import AppHeader from "./components/app-header";
import ServerInput from "./components/input/server-input";
import ListCategories from "./components/list-categories/list-categories";
import ListDescription from "./components/list-description";
import ListSettings from "./components/list-settings";
import useMutations from "./hooks/use-mutations";
import { listQueryOptions } from "./lib/queries";
import { cn } from "./lib/utils";
import ErrorDisplay from "./components/base/error";
import Loader from "@/app/components/base/loader";
import useCurrentList from "./hooks/use-current-list";

const ListPage: React.FC = () => {
  const { listId } = useCurrentList();
  const listQuery = useQuery(listQueryOptions(listId));

  const listNameInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!listQuery.data?.name) {
      listNameInputRef.current?.focus();
    }
  }, [listQuery.data?.name]);

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
        <ErrorDisplay error={listQuery.error} showGoHome />
      </div>
    );

  return (
    <div className="flex h-full flex-col">
      <AppHeader>
        <h1 className={cn("flex-1 text-lg font-bold")}>
          <ServerInput
            ref={listNameInputRef}
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
      <section className="flex-1 overflow-auto">
        <div className="container2 flex flex-col gap-4 py-4 pb-20">
          <ListDescription list={listQuery.data} />
          <ListCategories categories={listQuery.data.categories} />
        </div>
      </section>
    </div>
  );
};

export default ListPage;
