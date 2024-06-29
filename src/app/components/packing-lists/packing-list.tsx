import { cn } from "@/app/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

import { MoreHorizontal, Delete, Copy } from "lucide-react";
import { Button } from "@/app/components/ui/button";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Gripper from "@/app/components/base/gripper";
import { useStore } from "@/app/lib/store";
import { Link, useLocation } from "@tanstack/react-router";
import type { List } from "astro:db";
import useMutations from "@/app/hooks/useMutations";

interface Props {
  list: typeof List.$inferSelect;
  isOverlay?: boolean;
}

const PackingList: React.FC<Props> = (props) => {
  const { list, isOverlay } = props;
  const { pathname } = useLocation();

  const { toggleMobileSidebar } = useStore();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { deleteList } = useMutations();

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
              onClick={() => deleteList.mutate({ listId: list.id })}
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
        <Link
          to={`/list/$listId`}
          params={{ listId: list.id }}
          onClick={() => toggleMobileSidebar(false)}
          className={cn(
            "flex-1 truncate text-sm",
            !list.name && "italic text-muted-foreground",
          )}
        >
          {list.name || "Unnamed List"}
        </Link>
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
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              Delete List
              <DropdownMenuShortcut>
                <Delete size="1rem" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled
              onClick={() => deleteList.mutate({ listId: list.id })}
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
