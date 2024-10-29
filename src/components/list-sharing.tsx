import type { ListSelect } from "@/lib/types";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

import { Button, buttonVariants } from "./ui/button";
import { ArrowRight, Check, Copy, Share } from "lucide-react";
import { Label } from "./ui/label";
import useMutations from "@/hooks/use-mutations";
import { Input } from "./ui/input";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-is-mobile";

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
    <Popover>
      <PopoverTrigger asChild>
        {isMobile ? (
          <Button size="icon" variant="ghost">
            <Share className="size-4" />
          </Button>
        ) : (
          <Button variant="ghost">
            <Share className="mr-2 size-4" />
            <span>Share</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-2">
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
            <Label>Make list public</Label>
          </div>
          {list.isPublic && (
            <>
              <div className="text-sm text-muted-foreground">
                Anyone with the link can view this list
              </div>
              <div className="flex items-center gap-2">
                <Input
                  onFocus={(e) => e.target.select()}
                  className="w-full truncate rounded border p-2"
                  type="text"
                  value={publicUrl}
                  readOnly
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleCopy}
                      className="shrink-0"
                    >
                      {hasBeenCopied ? (
                        <Check className="size-4 text-green-500" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {hasBeenCopied ? "Copied!" : "Copy link"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <a
                className={cn(
                  buttonVariants({ variant: "linkMuted", size: "sm" }),
                  "mt-1 h-auto justify-start",
                )}
                href={publicUrl}
                target="_blank"
              >
                <span>Preview your list</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ListSharing;
