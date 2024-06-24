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

import type { List } from "astro:db";
import { weightUnits, type WeightUnit } from "@/api/lib/weight-units";
import useMutations from "../hooks/useMutations";

interface Props {
  list: typeof List.$inferSelect;
}

const ListSettings: React.FC<Props> = (props) => {
  const { list } = props;

  const { updateList } = useMutations();

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
                updateList.mutate({ data: { weightUnit: value as WeightUnit } })
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
            updateList.mutate({ data: { showPacked: checked } })
          }
        >
          Show Packed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={list.showImages}
          onCheckedChange={(checked) =>
            updateList.mutate({ data: { showImages: checked } })
          }
        >
          Show Images
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={list.showWeights}
          onCheckedChange={(checked) =>
            updateList.mutate({ data: { showWeights: checked } })
          }
        >
          Show Weight
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          disabled
          checked={list.showPrices}
          onCheckedChange={(checked) =>
            updateList.mutate({ data: { showPrices: checked } })
          }
        >
          Show Prices
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListSettings;
