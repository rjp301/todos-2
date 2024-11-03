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
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useEventListener } from "usehooks-ts";
import { getHasModifier, getIsTyping } from "@/lib/utils";

interface Props {
  list: ExpandedList;
}

type ListSetting = {
  name: string;
  shortcut: string;
  key: "showPacked" | "showImages" | "showWeights";
};

const listSettings: ListSetting[] = [
  {
    name: "Show packed",
    shortcut: "P",
    key: "showPacked",
  },
  {
    name: "Show images",
    shortcut: "I",
    key: "showImages",
  },
  {
    name: "Show weights",
    shortcut: "W",
    key: "showWeights",
  },
];

const ListSettings: React.FC<Props> = (props) => {
  const { list } = props;
  const listId = list.id;

  const { updateList, unpackList } = useMutations();

  const isMobile = useIsMobile();

  const isAnyPacked = list.categories.some((c) =>
    c.items.some((i) => i.packed),
  );

  useEventListener("keydown", (e) => {
    if (getIsTyping() || getHasModifier(e)) return;
    listSettings.forEach(({ shortcut, key }) => {
      if (e.code === `Key${shortcut}`) {
        updateList.mutate({ listId, data: { [key]: !list[key] } });
      }
    });
  });

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
          {listSettings.map(({ name, shortcut, key }) => (
            <div key={key} className="flex items-center gap-2">
              <Switch
                checked={list[key] as boolean}
                onCheckedChange={(checked) =>
                  updateList.mutate({ listId, data: { [key]: checked } })
                }
              />
              <Label className="flex w-full items-center justify-between gap-2">
                <span>{name}</span>
                <span className="w-4 text-center text-xs text-muted-foreground">
                  {shortcut}
                </span>
              </Label>
            </div>
          ))}
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
