import React from "react";

import useMutations from "@/hooks/use-mutations";
import { MessageSquare, Send } from "lucide-react";
import {
  Button,
  Heading,
  IconButton,
  Popover,
  Text,
  TextArea,
  Tooltip,
} from "@radix-ui/themes";

const FeedbackButton: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { addFeedback } = useMutations();

  return (
    <Tooltip side="left" content="Leave feedback">
      <Popover.Root
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) setValue("");
        }}
      >
        <Popover.Trigger className="fixed bottom-6 right-6 z-50">
          <IconButton variant="soft" radius="full" size="3">
            <MessageSquare className="size-5" />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content align="end" className="grid gap-4">
          <header>
            <Heading size="3" weight="medium">
              Leave Feedback
            </Heading>
            <Text size="2" color="gray">
              Want a feature added? Don't like something? Your feedback helps us
              improve the app for everyone 🚀
            </Text>
          </header>
          <form
            className="grid gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              addFeedback.mutate({ feedback: value });
              setValue("");
            }}
          >
            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              placeholder="Let's hear it"
            />
            <Button type="submit" variant="soft">
              <Send className="mr-2 size-4" />
              <span>Submit</span>
            </Button>
          </form>
        </Popover.Content>
      </Popover.Root>
    </Tooltip>
  );
};

export default FeedbackButton;
