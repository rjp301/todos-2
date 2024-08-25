import AppHeader from "@/app/components/app-header";
import { createFileRoute } from "@tanstack/react-router";
import { HomeIcon } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  component: () => (
    <div className="h-full">
      <AppHeader />
      <div className="container2 flex h-full items-center justify-center">
        <div className="flex h-full max-h-[50vh] flex-col items-center gap-2">
          <HomeIcon size="4rem" className="text-primary" />
          <h2 className="text-2xl font-bold">Welcome to Packlighter</h2>
          <p className="text-sm text-muted-foreground">
            Select a list to get packing
          </p>
        </div>
      </div>
    </div>
  ),
});
