import React from "react";

import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/queries";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/lib/theme/theme-toggle";
import useMutations from "@/hooks/use-mutations";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { Avatar, Button, Link, Popover, Text } from "@radix-ui/themes";

const UserAvatar: React.FC = () => {
  const [DeletionConfirmDialog, confirmDeleteAccount] = useConfirmDialog({
    title: "Are you absolutely sure?",
    description:
      "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  });
  const { deleteUser } = useMutations();

  const { data: user } = useQuery(userQueryOptions);

  if (!user) {
    return null;
  }

  return (
    <>
      <DeletionConfirmDialog />
      <Popover.Root>
        <Popover.Trigger title="User settings" className="cursor-pointer">
          <button>
            <Avatar
              size="2"
              src={user.avatarUrl ?? ""}
              fallback={<i className="fa-solid fa-user" />}
              radius="full"
            />
          </button>
        </Popover.Trigger>
        <Popover.Content
          align="start"
          className="z-30 grid w-auto min-w-52 gap-4"
        >
          <div className="flex max-w-min gap-4">
            <Avatar
              size="5"
              radius="full"
              src={user.avatarUrl ?? ""}
              alt={user.name}
              fallback={<i className="fa-solid fa-user text-6" />}
            />
            <div className="flex flex-col justify-center">
              <Text weight="bold" size="3">
                {user.name}
              </Text>
              <Text
                size="2"
                color="gray"
                className="text-sm text-muted-foreground"
              >
                {user.email}
              </Text>
            </div>
          </div>

          <ThemeToggle />

          <div className="grid w-full gap-2">
            <Button asChild variant="surface" color="amber">
              <a href="/logout" className={cn("relative")}>
                <i className="fa-solid fa-arrow-right-from-bracket absolute left-4 w-4" />
                <span>Logout</span>
              </a>
            </Button>
            <Button
              color="red"
              variant="surface"
              onClick={async () => {
                const ok = await confirmDeleteAccount();
                if (ok) {
                  deleteUser.mutate({});
                }
              }}
              className="relative"
            >
              <i className="fa-solid fa-trash absolute left-4 w-4" />
              <span>Delete Account</span>
            </Button>
          </div>
          <Link href="/policies" size="1" color="gray">
            View application policies
          </Link>
        </Popover.Content>
      </Popover.Root>
    </>
  );
};

export default UserAvatar;
