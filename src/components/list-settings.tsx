import React from "react";

import useMutations from "@/hooks/use-mutations";
import { weightUnits, type ExpandedList, type WeightUnit } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useEventListener } from "usehooks-ts";
import { getHasModifier, getIsTyping } from "@/lib/utils";
import {
  Button,
  IconButton,
  Popover,
  SegmentedControl,
  Switch,
  Text,
} from "@radix-ui/themes";

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
    <Popover.Root>
      <Popover.Trigger title="List settings">
        {isMobile ? (
          <IconButton variant="soft" color="gray">
            <i className="fa-solid fa-gear" />
          </IconButton>
        ) : (
          <Button variant="soft" color="gray">
            <i className="fa-solid fa-gear" />
            Settings
          </Button>
        )}
      </Popover.Trigger>
      <Popover.Content className="grid w-60 gap-4">
        <div className="grid w-full">
          <Button
            variant="soft"
            onClick={() => unpackList.mutate({ listId })}
            disabled={!isAnyPacked || !list.showPacked}
          >
            <i className="fa-solid fa-undo" />
            Unpack List
          </Button>
        </div>

        <div className="grid gap-3">
          {listSettings.map(({ name, shortcut, key }) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <Text
                as="label"
                size="2"
                weight="medium"
                className="flex items-center gap-2"
              >
                <Switch
                  checked={list[key] as boolean}
                  onCheckedChange={(checked) =>
                    updateList.mutate({ listId, data: { [key]: checked } })
                  }
                />
                {name}
              </Text>
              <Text color="gray" className="w-4" align="center">
                {shortcut}
              </Text>
            </div>
          ))}
        </div>

        <SegmentedControl.Root
          id="default-weight"
          className="grid grid-cols-4"
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
            <SegmentedControl.Item
              value={symbol}
              key={symbol}
              aria-label={`Toggle ${name}`}
            >
              {symbol}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ListSettings;
