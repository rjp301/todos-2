import type { ListSelect } from "@/lib/types";
import React from "react";
import Markdown from "react-markdown";
import useMutations from "@/hooks/use-mutations";
import { flushSync } from "react-dom";
import invariant from "tiny-invariant";
import { useEventListener } from "usehooks-ts";
import { Button, Link, Text, TextArea } from "@radix-ui/themes";

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
        <Text as="label" htmlFor="description" size="2" weight="medium">
          Description
        </Text>
        {isEditing ? (
          <>
            <Button
              size="1"
              variant="ghost"
              disabled={value === list.description}
              type="submit"
            >
              <span>Save changes</span>
            </Button>
            <Button
              size="1"
              variant="ghost"
              color="amber"
              type="submit"
              onClick={cancel}
            >
              <span>Cancel</span>
            </Button>
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
            size="1"
            variant="ghost"
          >
            Edit
          </Button>
        )}
      </div>
      {isEditing ? (
        <>
          <TextArea
            ref={inputRef}
            id="description"
            name="description"
            value={value}
            rows={3}
            onChange={(e) => {
              setValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          <Link
            size="1"
            color="gray"
            href="https://www.markdownguide.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Markdown supported
          </Link>
        </>
      ) : (
        <div className="shadow rounded-3 bg-gray-2 p-4">
          <Markdown className="text-sm prose prose-sm max-w-none dark:prose-invert">
            {list.description || "*No description*"}
          </Markdown>
        </div>
      )}
    </form>
  );
};

export default ListDescription;
