import React from "react";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import useMutations from "@/hooks/use-mutations";
import { MessageSquare, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const FeedbackButton: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { addFeedback } = useMutations();

  return (
    <Tooltip>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) setValue("");
        }}
      >
        <PopoverTrigger asChild className="fixed bottom-6 right-6 z-50">
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="size-10 rounded-full border shadow-md"
            >
              <MessageSquare className="size-5" />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <PopoverContent align="end" className="grid gap-4">
          <CardHeader className="p-0">
            <CardTitle>Leave Feedback</CardTitle>
            <CardDescription>
              Want a feature added? Don't like something? Your feedback helps us
              improve the app for everyone 🚀
            </CardDescription>
          </CardHeader>
          <form
            className="grid gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              addFeedback.mutate({ feedback: value });
              setValue("");
            }}
          >
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              placeholder="Let's hear it"
            />
            <Button type="submit">
              <Send className="mr-2 size-4" />
              <span>Submit</span>
            </Button>
          </form>
        </PopoverContent>
      </Popover>
      <TooltipContent side="left">Leave feedback</TooltipContent>
    </Tooltip>
  );
};

export default FeedbackButton;
