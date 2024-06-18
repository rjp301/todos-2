import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/app/components/app-header";
import Loader from "@/components/base/loader";
import { DataTable } from "@/app/components/gear-table/data-table";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "@/app/components/gear-table/columns";
import { itemsQueryOptions } from "../lib/queries";

const GearPage: React.FC = () => {
  const itemsQuery = useQuery(itemsQueryOptions);

  return (
    <div className="flex h-full flex-col">
      <AppHeader>
        <span className="font-semibold">Gear Catalogue</span>
        <div className="flex items-center gap-4 border-r pr-4">
          <Button variant="secondary">
            <Plus size="1rem" className="mr-2" />
            Add Item
          </Button>
        </div>
      </AppHeader>
      {itemsQuery.isSuccess && (
        <div className="overflow-auto px-4 py-2">
          <DataTable columns={columns} data={itemsQuery.data} />
        </div>
      )}
      {itemsQuery.isLoading && <Loader />}
    </div>
  );
};

export const Route = createFileRoute("/_app/gear")({
  component: GearPage,
});
