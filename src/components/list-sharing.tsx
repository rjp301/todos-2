import type { ListSelect } from "@/lib/types";
import React from "react";

import { ArrowRight, Check, Copy, Share } from "lucide-react";
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
            <Share className="size-4" />
          </IconButton>
        ) : (
          <Button variant="soft" color="gray">
            <Share className="size-4" />
            <span>Share</span>
          </Button>
        )}
      </Popover.Trigger>
      <Popover.Content className="w-72">
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={list.isPublic}
              onCheckedChange={(checked) =>
                updateList.mutate({
                  data: { isPublic: checked },
                  listId: list.id,
                })
              }
            />
            <Text weight="medium">Make list public</Text>
          </div>
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
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
              <Link
                size="2"
                className="mt-1 flex items-center gap-1"
                href={publicUrl}
                target="_blank"
              >
                Preview your list
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ListSharing;
