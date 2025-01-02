import { Plus } from "lucide-react";
import React from "react";
import AppHeader from "@/components/app-header";
import useMutations from "@/hooks/use-mutations";
import { Button, Heading, Separator, Text } from "@radix-ui/themes";

const HomePage: React.FC = () => {
  const { addList } = useMutations();
  return (
    <div className="h-full">
      <AppHeader />
      <div className="container2 flex h-full items-center justify-center">
        <div className="flex h-full max-h-[50vh] flex-col items-center gap-2">
          <i className="fa-solid fa-house-chimney text-accent-10 mb-4 text-[3rem]" />
          <Heading as="h2" size="4">
            Welcome to LighterTravel
          </Heading>
          <Text size="2" color="gray">
            Select a list to get packing
          </Text>
          <Separator className="relative my-4" size="4">
            <Text
              size="2"
              weight="medium"
              className="bg-gray-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform px-2 text-xs text-muted-foreground"
            >
              OR
            </Text>
          </Separator>
          <Button variant="soft" onClick={() => addList.mutate({})}>
            <Plus className="mr-2 size-4" />
            <span>Create a new list</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
