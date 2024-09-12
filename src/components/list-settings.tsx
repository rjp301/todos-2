import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Settings, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";

import { weightUnits, type WeightUnit } from "@/lib/weight-units";
import useMutations from "@/hooks/use-mutations";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";
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
    <Popover>
      <PopoverTrigger asChild title="List settings">
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
      </PopoverTrigger>
      <PopoverContent className="grid w-52 gap-4">
        <div className="grid w-full">
          <Button
            variant="secondary"
            onClick={() => unpackList.mutate({ listId })}
          >
            <Undo className="mr-2 size-4" />
            Unpack List
          </Button>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={list.showPacked}
              onCheckedChange={(checked) =>
                updateList.mutate({ listId, data: { showPacked: checked } })
              }
            />
            <Label>Show packed</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={list.showImages}
              onCheckedChange={(checked) =>
                updateList.mutate({ listId, data: { showImages: checked } })
              }
            />
            <Label>Show images</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={list.showWeights}
              onCheckedChange={(checked) =>
                updateList.mutate({ listId, data: { showWeights: checked } })
              }
            />
            <Label>Show weights</Label>
          </div>
        </div>

        <ToggleGroup
          id="default-weight"
          className="grid grid-cols-4"
          type="single"
          value={list.weightUnit}
          onValueChange={(value) => {
            if (!value) return;
            updateList.mutate({
              listId,
              data: { weightUnit: value as WeightUnit },
            });
          }}
        >
          {Object.values(weightUnits).map((unit) => (
            <ToggleGroupItem
              value={unit}
              key={unit}
              aria-label={`Toggle ${unit}`}
            >
              {unit}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
};

export default ListSettings;
