import React from "react";

import LoginButton from "./login-button";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/queries";
import { LogOut, Trash, User } from "lucide-react";
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

  const userQuery = useQuery(userQueryOptions);

  if (userQuery.isLoading) {
    return null;
  }

  if (userQuery.isError) {
    return <div>Error loading user</div>;
  }

  const user = userQuery.data;

  if (!user) {
    return (
      <span className="flex gap-1">
        <LoginButton provider="github" />
        <LoginButton provider="google" />
      </span>
    );
  }

  return (
    <>
      <DeletionConfirmDialog />
      <Popover.Root>
        <Popover.Trigger title="User settings" className="cursor-pointer">
          <Avatar
            size="3"
            src={user.avatarUrl ?? ""}
            fallback={<User size="3rem" />}
            radius="full"
          />
        </Popover.Trigger>
        <Popover.Content align="end" className="grid w-auto min-w-52 gap-4">
          <div className="flex max-w-min gap-4">
            <Avatar
              size="5"
              radius="full"
              src={user.avatarUrl ?? ""}
              alt={user.name}
              fallback={<User size="3rem" />}
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
                <LogOut className="absolute left-4 mr-2 size-4" />
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
              <Trash className="absolute left-4 mr-2 size-4" />
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
