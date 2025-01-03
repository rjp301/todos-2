import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import useMutations from "@/hooks/use-mutations";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { otherListCategoriesQueryOptions } from "@/lib/queries";
import useCurrentList from "@/hooks/use-current-list";
import { Badge, Button, Popover } from "@radix-ui/themes";

const NEW_CATEGORY_VALUE = "create-new-category-" + uuidv4();

const AddCategoryPopover: React.FC = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { listId } = useCurrentList();

  const { data } = useQuery(otherListCategoriesQueryOptions(listId));
  const otherCategoriesExist = data && data.length > 0;

  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  const { addCategory, copyCategoryToList } = useMutations();

  return (
    <>
      {isOpen && <div className="bg-black/50 fixed inset-0 z-40" />}
      <Popover.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (open) setValue("");
          setIsOpen(open);
        }}
      >
        <Popover.Trigger>
          <Button
            ref={buttonRef}
            size="1"
            color="gray"
            variant="ghost"
            role="combobox"
            aria-expanded={isOpen}
          >
            <i className="fa-solid fa-plus" />
            <span>Add Category</span>
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="z-30 w-[300px] p-0"
          align="start"
          side="bottom"
        >
          <Command
            loop
            filter={(value, search) => {
              if (value === NEW_CATEGORY_VALUE) return 1;
              if (value.toLowerCase().includes(search.toLowerCase())) return 1;
              return 0;
            }}
          >
            <CommandInput
              placeholder="Enter name..."
              value={value}
              onValueChange={setValue}
            />
            <CommandList>
              <CommandEmpty> No suggestions </CommandEmpty>
              {value && (
                <CommandGroup>
                  <CommandItem
                    value={NEW_CATEGORY_VALUE}
                    onSelect={() => {
                      addCategory.mutate({ listId, data: { name: value } });
                      setIsOpen(false);
                      buttonRef.current?.focus();
                    }}
                  >
                    <i className="fa-solid fa-plus mr-2 text-accent-10" />
                    <span>Create new category "{value}"</span>
                  </CommandItem>
                </CommandGroup>
              )}
              {otherCategoriesExist && (
                <>
                  <CommandGroup heading="Copy from another list">
                    {data?.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={`${category.name}-${category.listId}-${category.id}`}
                        className="flex justify-between gap-1"
                        onSelect={() => {
                          copyCategoryToList.mutate({
                            categoryId: category.id,
                            listId,
                          });
                          setIsOpen(false);
                          buttonRef.current?.focus();
                        }}
                      >
                        <span>{category.name}</span>
                        <Badge
                          title={category.listName}
                          variant="soft"
                          className="bg-secondary max-w-[8rem]"
                        >
                          <span className="truncate">{category.listName}</span>
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Root>
    </>
  );
};

export default AddCategoryPopover;
