import type { ListSelect } from "@/lib/types";
import React from "react";

import useMutations from "@/hooks/use-mutations";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";

import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  Button,
  IconButton,
  Link,
  Popover,
  Switch,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";

type Props = {
  list: ListSelect;
};

const ListSharing: React.FC<Props> = (props) => {
  const { list } = props;
  const { updateList } = useMutations();
  const [copiedText, copy] = useCopyToClipboard();

  const publicUrl = `${window.location.origin}/v/${list.id}`;
  const hasBeenCopied = copiedText === publicUrl;
  const handleCopy = () =>
    copy(publicUrl)
      .then(() => toast.success("Copied link to clipboard"))
      .catch(() => toast.error("Failed to copy link"));

  const isMobile = useIsMobile();

  return (
    <Popover.Root>
      <Popover.Trigger>
        {isMobile ? (
          <IconButton variant="soft" color="gray">
            <i className="fa-solid fa-share" />
          </IconButton>
        ) : (
          <Button variant="soft" color="gray">
            <i className="fa-solid fa-share" />
            <span>Share</span>
          </Button>
        )}
      </Popover.Trigger>
      <Popover.Content className="w-72">
        <div className="grid gap-4">
          <Text as="label" weight="medium" className="flex items-center gap-2">
            <Switch
              checked={list.isPublic}
              onCheckedChange={(checked) =>
                updateList.mutate({
                  data: { isPublic: checked },
                  listId: list.id,
                })
              }
            />
            Make list public
          </Text>
          {list.isPublic && (
            <div className="grid gap-2">
              <Text size="2" color="gray">
                Anyone with the link can view this list
              </Text>
              <div className="flex items-center gap-2">
                <TextField.Root
                  onFocus={(e) => e.target.select()}
                  type="text"
                  value={publicUrl}
                  readOnly
                  className="min-w-0 flex-1 truncate"
                />
                <Tooltip
                  side="right"
                  content={hasBeenCopied ? "Copied!" : "Copy link"}
                >
                  <IconButton variant="soft" onClick={handleCopy}>
                    {hasBeenCopied ? (
                      <i className="fa-solid fa-check" />
                    ) : (
                      <i className="fa-solid fa-check" />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
              <Link size="2" className="mt-1" href={publicUrl} target="_blank">
                Preview your list
                <i className="fa-solid fa-arrow-right ml-1" />
              </Link>
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ListSharing;
