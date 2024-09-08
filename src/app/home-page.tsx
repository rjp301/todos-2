import { HomeIcon, Plus } from "lucide-react";
import React from "react";
import AppHeader from "./components/app-header";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import useMutations from "./hooks/use-mutations";

const HomePage: React.FC = () => {
  const { addList } = useMutations();
  return (
    <div className="h-full">
      <AppHeader />
      <div className="container2 flex h-full items-center justify-center">
        <div className="flex h-full max-h-[50vh] flex-col items-center gap-2">
          <HomeIcon size="4rem" className="text-primary" />
          <h2 className="text-2xl font-bold">Welcome to TrekReady</h2>
          <p className="text-sm text-muted-foreground">
            Select a list to get packing
          </p>
          <Separator className="relative my-4">OR</Separator>
          <Button variant="default" onClick={() => addList.mutate({})}>
            <Plus className="mr-2 size-4" />
            <span>Create a new list</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
