import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import { Button, Heading, TextField } from "@radix-ui/themes";
import React from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

const ListNameForm = React.forwardRef<
  HTMLFormElement,
  {
    initialValue: string;
    onSubmit: (value: string) => void;
  }
>(({ initialValue, onSubmit }, ref) => {
  const [value, setValue] = React.useState(initialValue);

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <TextField.Root
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="3"
        placeholder="Unnamed List"
      >
        <TextField.Slot side="right" className="gap-2">
          <Button size="1" type="submit">
            Save changes
          </Button>
          <Button
            size="1"
            variant="soft"
            color="amber"
            onClick={() => setValue(initialValue)}
          >
            Cancel
          </Button>
        </TextField.Slot>
      </TextField.Root>
    </form>
  );
});

const ListName: React.FC<{ list: ListSelect }> = ({ list }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const { updateList } = useMutations();

  const formRef = React.useRef<HTMLFormElement>(null);

  useOnClickOutside(formRef, () => setIsEditing(false));
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") setIsEditing(false);
  });

  if (isEditing) {
    return (
      <ListNameForm
        ref={formRef}
        initialValue={list.name}
        onSubmit={(value) => {
          setIsEditing(false);
          updateList.mutate({ listId: list.id, data: { name: value } });
        }}
      />
    );
  }

  return (
    <div className="flex items-center gap-4 min-h-[2.5rem]">
      <Heading onClick={() => setIsEditing(true)}>{list.name}</Heading>
      <Button size="1" variant="ghost" onClick={() => setIsEditing(true)}>
        Edit
      </Button>
    </div>
  );
};

export default ListName;
