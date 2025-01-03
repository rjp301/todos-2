import React from "react";
import useMutations from "@/hooks/use-mutations";
import { Button, Heading, Separator, Text } from "@radix-ui/themes";

const HomePage: React.FC = () => {
  const { addList } = useMutations();
  return (
    <div className="h-full">
      <div className="container2 flex h-full items-center justify-center">
        <div className="flex h-full max-h-[50vh] flex-col items-center gap-2">
          <i className="fa-solid fa-house-chimney mb-4 text-[3rem] text-accent-10" />
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
              className="text-xs text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-gray-1 px-2"
            >
              OR
            </Text>
          </Separator>
          <Button variant="soft" onClick={() => addList.mutate({})}>
            <i className="fa-solid fa-plus" />
            <span>Create a new list</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
