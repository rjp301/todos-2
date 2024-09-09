import type { ListSelect } from "@/lib/types";
import React from "react";
import { Textarea } from "./ui/textarea";
import Markdown from "react-markdown";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import useMutations from "@/hooks/use-mutations";
import { flushSync } from "react-dom";
import invariant from "tiny-invariant";
import { useEventListener } from "usehooks-ts";

const focusInputAtEnd = (inputElement: HTMLTextAreaElement) => {
  if (inputElement) {
    inputElement.focus();
    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
  }
};

type Props = {
  list: ListSelect;
};

const ListDescription: React.FC<Props> = (props) => {
  const { list } = props;

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { updateList } = useMutations();

  const save = () => {
    updateList.mutate({ listId: list.id, data: { description: value } });
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setValue(list.description);
  };

  useEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") cancel();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") save();
    },
    inputRef,
  );

  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(list.description);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className="flex items-baseline gap-2">
        <Label htmlFor="description">Description</Label>
        {isEditing ? (
          <>
            <Button
              className="h-6"
              size="sm"
              variant="linkMuted"
              disabled={value === list.description}
              type="submit"
            >
              <span>Save changes</span>
            </Button>
            <Button
              className="h-6"
              size="sm"
              variant="linkMuted"
              type="submit"
              onClick={cancel}
            >
              <span>Cancel</span>
            </Button>
            <a
              href="https://www.markdownguide.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-500 hover:underline"
            >
              Markdown supported
            </a>
          </>
        ) : (
          <Button
            onClick={() => {
              flushSync(() => {
                setValue(list.description);
                setIsEditing(true);
              });
              const textarea = inputRef.current;
              invariant(textarea);
              focusInputAtEnd(textarea);
              textarea.style.height = "auto";
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            size="sm"
            variant="linkMuted"
            className="h-6"
          >
            Edit
          </Button>
        )}
      </div>
      {isEditing ? (
        <Textarea
          ref={inputRef}
          id="description"
          name="description"
          value={value}
          rows={3}
          className="resize-none overflow-hidden p-4"
          onChange={(e) => {
            setValue(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
      ) : (
        <div className="rounded-md bg-muted/20 p-4 shadow">
          <Markdown className="prose prose-sm max-w-none text-sm dark:prose-invert">
            {list.description || "*No description*"}
          </Markdown>
        </div>
      )}
    </form>
  );
};

export default ListDescription;
