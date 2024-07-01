import { cn } from "@/app/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

import Gripper from "@/app/components/base/gripper";
import { useStore } from "@/app/lib/store";
import { Link, useLocation } from "@tanstack/react-router";
import useMutations from "@/app/hooks/useMutations";
import type { DraggableProvided } from "react-beautiful-dnd";
import type { ListSelect } from "@/api/lib/types";

interface Props {
  list: ListSelect;
  provided: DraggableProvided;
  isDragging?: boolean;
}

const PackingList: React.FC<Props> = (props) => {
  const { list, isDragging, provided } = props;
  const { pathname } = useLocation();

  const { toggleMobileSidebar } = useStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { deleteList } = useMutations();

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
        {...provided.draggableProps}
        ref={provided.innerRef}
        className={cn(
          "flex items-center gap-2 py-0.5 pl-4 pr-2 hover:border-l-4 hover:pl-3",
          pathname === `/list/${list.id}` &&
            "border-l-4 border-primary bg-secondary pl-3 text-secondary-foreground",
          isDragging && "rounded border bg-card/70",
        )}
      >
        <Gripper {...provided.dragHandleProps} isGrabbing={isDragging} />
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
            <Button variant="ghost" className={cn("h-8 w-8 p-0")}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              <Delete size="1rem" className="mr-2" />
              Delete List
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled
              onClick={() => deleteList.mutate({ listId: list.id })}
            >
              <Copy size="1rem" className="mr-2" />
              Duplicate List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default PackingList;
