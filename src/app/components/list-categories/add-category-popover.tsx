import React from "react";

import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Plus } from "lucide-react";
import useMutations from "@/app/hooks/use-mutations";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { otherListCategoriesQueryOptions } from "@/app/lib/queries";
import { Badge } from "../ui/badge";
import useCurrentList from "@/app/hooks/use-current-list";

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
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50" />}
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          if (open) setValue("");
          setIsOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            size="sm"
            variant="linkMuted"
            role="combobox"
            aria-expanded={isOpen}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
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
              <CommandGroup>
                <CommandItem
                  value={NEW_CATEGORY_VALUE}
                  onSelect={() => {
                    addCategory.mutate({ listId, data: { name: value } });
                    setIsOpen(false);
                    buttonRef.current?.focus();
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" />
                  <span>Create new category</span>
                </CommandItem>
              </CommandGroup>
              {otherCategoriesExist && (
                <>
                  <CommandSeparator />
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
                          variant="outline"
                          className="max-w-[8rem] truncate bg-card"
                        >
                          {category.listName}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AddCategoryPopover;
