import React from "react";

import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { itemsQueryOptions } from "@/app/lib/queries";
import { CommandLoading } from "cmdk";
import { toast } from "sonner";
import useMutations from "@/app/hooks/use-mutations";
import type { ExpandedCategory } from "@/api/lib/types";
import { initCategoryItem } from "@/app/lib/init";

type Props = {
  category: ExpandedCategory;
};

const AddItemPopover: React.FC<Props> = (props) => {
  const { category } = props;

  const [open, setOpen] = React.useState(false);
  const { addItemToCategory } = useMutations();
  const { data: items = [], isLoading } = useQuery(itemsQueryOptions);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="linkMuted"
          role="combobox"
          aria-expanded={open}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Gear
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Enter name..." />
          <CommandList>
            {isLoading && <CommandLoading>Loading...</CommandLoading>}
            <CommandEmpty>
              <CommandItem value="new">Create new gear</CommandItem>
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    const newCategoryItem = initCategoryItem({
                      itemData: item,
                      categoryId: category.id,
                    });
                    addItemToCategory.mutate({
                      categoryId: category.id,
                      itemId: item.id,
                      categoryItems: [...category.items, newCategoryItem],
                      categoryItemId: newCategoryItem.id,
                    });
                    setOpen(false);
                  }}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AddItemPopover;
