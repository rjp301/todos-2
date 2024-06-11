import { cn } from "@/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal, Delete, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Gripper from "../base/gripper";
import { toast } from "sonner";
import useListId from "@/hooks/use-list-id";
import type { List } from "@/api/db/schema.ts";
import { api, client } from "@/lib/client.ts";

import { navigate } from "astro:transitions/client";
import { listsQueryOptions } from "@/lib/queries.ts";

interface Props {
  list: List;
  isOverlay?: boolean;
}

const PackingList: React.FC<Props> = (props) => {
  const { list, isOverlay } = props;
  const listId = useListId();
  const { pathname } = new URL(window.location.href);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const deleteToastId = React.useRef<string | number | undefined>(undefined);
  const deleteListMutation = useMutation(
    {
      mutationFn: (id: string) => api.lists.delete.$post({ json: { id } }),
      onMutate: () => {
        deleteToastId.current = toast.loading("Deleting list...");
      },
      onSuccess: (_, variables) => {
        client.invalidateQueries({ queryKey: listsQueryOptions.queryKey });
        toast.success("List deleted successfully", {
          id: deleteToastId.current,
        });
        if (variables === listId) {
          navigate("/");
        }
      },
      onError: (error) => {
        toast.error(error.message, { id: deleteToastId.current });
      },
    },
    client,
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              packing list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteListMutation.mutate(list.id)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div
        key={list.id}
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center gap-2 py-0.5 pl-4 pr-2 hover:border-l-4 hover:pl-3",
          pathname === `/list/${list.id}` &&
            "border-l-4 border-primary bg-secondary pl-3 text-secondary-foreground",
          isOverlay && "rounded border bg-card/70",
          isDragging && "opacity-30",
        )}
      >
        <Gripper {...attributes} {...listeners} isGrabbing={isOverlay} />
        <a
          href={`/list/${list.id}`}
          className={cn(
            "flex-1 truncate text-sm",
            !list.name && "italic text-muted-foreground",
          )}
        >
          {list.name || "Unnamed List"}
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn("h-8 w-8 p-0", isDragging && "opacity-0")}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              Delete List
              <DropdownMenuShortcut>
                <Delete size="1rem" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled
              onClick={() => deleteListMutation.mutate(list.id)}
            >
              Duplicate List
              <DropdownMenuShortcut>
                <Copy size="1rem" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default PackingList;
