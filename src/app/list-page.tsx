import { useQuery } from "@tanstack/react-query";
import React from "react";
import EditorCategories from "@/components/list-editor/editor-categories";
import ListDescription from "@/components/list-description";
import ListSettings from "@/components/list-settings";
import { listQueryOptions } from "@/lib/queries";
import ErrorDisplay from "@/components/base/error";
import Loader from "@/components/base/loader";
import useCurrentList from "@/hooks/use-current-list";
import ListSharing from "@/components/list-sharing";
import ListName from "@/components/list-name";

const ListPage: React.FC = () => {
  const { listId } = useCurrentList();
  const listQuery = useQuery(listQueryOptions(listId));

  const listNameInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!listQuery.data?.name) {
      listNameInputRef.current?.focus();
    }
  }, [listQuery.data?.name]);

  if (listQuery.isLoading)
    return (
      <div className="h-full">
        <Loader />
      </div>
    );

  if (listQuery.isError || !listQuery.data)
    return (
      <div className="h-full">
        <ErrorDisplay error={listQuery.error} showGoHome />
      </div>
    );

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="container2 flex flex-col gap-8 py-6 pb-20">
        <header className="grid gap-5">
          <ListName list={listQuery.data} />
          <div className="grid w-72 grid-cols-2 gap-2">
            <ListSharing list={listQuery.data} />
            <ListSettings list={listQuery.data} />
          </div>
        </header>
        <ListDescription list={listQuery.data} />
        <EditorCategories categories={listQuery.data.categories} />
      </div>
    </div>
  );
};

export default ListPage;
