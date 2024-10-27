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

import useMutations from "@/hooks/use-mutations";
import { weightUnits, type ExpandedList, type WeightUnit } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventListener } from "usehooks-ts";
import useIsMac from "@/hooks/use-is-mac";

interface Props {
  list: ExpandedList;
}

const ListSettings: React.FC<Props> = (props) => {
  const { list } = props;
  const listId = list.id;

  const { updateList, unpackList } = useMutations();
  const isMobile = useIsMobile();

  const isAnyPacked = list.categories.some((c) =>
    c.items.some((i) => i.packed),
  );

  useEventListener("keydown", (e) => {
    if (e.code === "KeyI" && e.altKey) {
      updateList.mutate({ listId, data: { showImages: !list.showImages } });
    }
  });

  const isMac = useIsMac();

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
            disabled={!isAnyPacked || !list.showPacked}
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
            <Label className="flex w-full items-center justify-between">
              <span>Show images</span>
              <span className="text-xs text-muted-foreground">
                {isMac ? "⌥ + I" : "Alt + I"}
              </span>
            </Label>
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
          {Object.values(weightUnits).map(({ symbol, name }) => (
            <ToggleGroupItem
              value={symbol}
              key={symbol}
              aria-label={`Toggle ${name}`}
            >
              {symbol}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
};

export default ListSettings;
