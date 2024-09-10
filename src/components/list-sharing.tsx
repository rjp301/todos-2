import type { ListSelect } from "@/lib/types";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

import { Button } from "./ui/button";
import { Check, Copy, Share } from "lucide-react";
import { Label } from "./ui/label";
import useMutations from "@/hooks/use-mutations";
import { Input } from "./ui/input";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <Share className="mr-2 h-4 w-4" />
          <span>Share</span>
        </Button>
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
                  className="w-full rounded border p-2 truncate"
                  type="text"
                  value={publicUrl}
                  readOnly
                />
                <Button variant="secondary" onClick={handleCopy}>
                  {hasBeenCopied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ListSharing;
