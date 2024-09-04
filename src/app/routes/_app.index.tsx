import AppHeader from "@/app/components/app-header";
import { createFileRoute } from "@tanstack/react-router";
import { HomeIcon, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import useMutations from "../hooks/use-mutations";
import { Separator } from "../components/ui/separator";

const Component: React.FC = () => {
  const { addList } = useMutations();
  return (
    <div className="h-full">
      <AppHeader />
      <div className="container2 flex h-full items-center justify-center">
        <div className="flex h-full max-h-[50vh] flex-col items-center gap-2">
          <HomeIcon size="4rem" className="text-primary" />
          <h2 className="text-2xl font-bold">Welcome to Packlighter</h2>
          <p className="text-sm text-muted-foreground">
            Select a list to get packing
          </p>
          <Separator className="relative my-4">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </Separator>
          <Button variant="default" onClick={() => addList.mutate({})}>
            <Plus className="mr-2 size-4" />
            <span>Create a new list</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_app/")({
  component: Component,
});
