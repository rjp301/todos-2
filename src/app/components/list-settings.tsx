import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { listQueryOptions } from "@/app/lib/queries";

import type { List } from "astro:db";
import { weightUnits, type WeightUnit } from "@/api/lib/weight-units";

interface Props {
  list: typeof List.$inferSelect;
}

const ListSettings: React.FC<Props> = (props) => {
  const { list } = props;
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: Partial<typeof List.$inferInsert>) =>
      api.lists.update.$post({ json: { id: list.id, value: data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listQueryOptions(list.id).queryKey,
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>List Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Default unit of mass</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={list.weightUnit}
              onValueChange={(value) =>
                updateMutation.mutate({
                  weightUnit: value as WeightUnit,
                })
              }
            >
              {Object.values(weightUnits).map((unit) => (
                <DropdownMenuRadioItem value={unit} key={unit}>
                  {unit}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={list.showPacked}
          onCheckedChange={(checked) =>
            updateMutation.mutate({
              showPacked: checked,
            })
          }
        >
          Show Packed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={list.showImages}
          onCheckedChange={(checked) =>
            updateMutation.mutate({
              showImages: checked,
            })
          }
        >
          Show Images
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={list.showWeights}
          onCheckedChange={(checked) =>
            updateMutation.mutate({
              showWeights: checked,
            })
          }
        >
          Show Weight
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          disabled
          checked={list.showPrices}
          onCheckedChange={(checked) =>
            updateMutation.mutate({
              showPrices: checked,
            })
          }
        >
          Show Prices
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListSettings;
