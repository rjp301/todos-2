import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Scale, Settings, SquareCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

import { weightUnits, type WeightUnit } from "@/lib/weight-units";
import useMutations from "../hooks/use-mutations";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "../lib/constants";
import type { ListSelect } from "@/lib/types";

interface Props {
  list: ListSelect;
}

const ListSettings: React.FC<Props> = (props) => {
  const { list } = props;
  const listId = list.id;

  const { updateList, unpackList } = useMutations();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild title="List settings">
        {isMobile ? (
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="end">
        <DropdownMenuLabel>List Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Scale className="mr-2 size-4" />
            <span>Default weigh unit</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={list.weightUnit}
              onValueChange={(value) =>
                updateList.mutate({
                  listId,
                  data: { weightUnit: value as WeightUnit },
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
        <DropdownMenuItem onClick={() => unpackList.mutate({ listId })}>
          <SquareCheck className="mr-2 size-4" />
          <span>Unpack List</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={list.showPacked}
          onCheckedChange={(checked) =>
            updateList.mutate({ listId, data: { showPacked: checked } })
          }
        >
          Show packed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={list.showImages}
          onCheckedChange={(checked) =>
            updateList.mutate({ listId, data: { showImages: checked } })
          }
        >
          Show images
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={list.showWeights}
          onCheckedChange={(checked) =>
            updateList.mutate({ listId, data: { showWeights: checked } })
          }
        >
          Show weights
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListSettings;
