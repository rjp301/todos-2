import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button, Heading } from "@radix-ui/themes";
import React from "react";
import ConditionalForm from "./base/conditional-form";

const PLACEHOLDER = "Unnamed List";

const ListName: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { updateList } = useMutations();
  return (
    <ConditionalForm
      value={list.name}
      handleSubmit={(value) =>
        updateList.mutate({ listId: list.id, data: { name: value } })
      }
      textFieldProps={{
        size: "3",
        placeholder: PLACEHOLDER,
      }}
    >
      {({ startEditing }) => (
        <div className="flex min-h-[2.5rem] items-center gap-4">
          <Heading
            onClick={startEditing}
            className={cn(!list.name && "italic text-gray-10")}
          >
            {list.name || PLACEHOLDER}
          </Heading>
          <Button size="1" variant="ghost" onClick={startEditing}>
            Edit
          </Button>
        </div>
      )}
    </ConditionalForm>
  );
};

export default ListName;
