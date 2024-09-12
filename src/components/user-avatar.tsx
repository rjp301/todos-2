import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import useThemeStore, { type Theme } from "@/lib/theme/store";
import LoginButton from "./login-button";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/queries";
import { Laptop, LogOut, Moon, Sun, Trash, User } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AccountDeletionConfirm: React.FC<DialogProps> = (props) => {
  const { isOpen, setIsOpen } = props;
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form method="POST" action="/api/auth/delete">
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" asChild>
              <Button variant="destructive">Continue</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const themeOptions: {
  value: string;
  name: string;
  icon: React.ReactElement;
}[] = [
  {
    value: "light",
    name: "Light",
    icon: <Sun className="size-4" />,
  },
  {
    value: "dark",
    name: "Dark",
    icon: <Moon className="size-4" />,
  },
  {
    value: "system",
    name: "Auto",
    icon: <Laptop className="size-4" />,
  },
];

const UserAvatar: React.FC = () => {
  const [accountDeletionOpen, setAccountDeletionOpen] = React.useState(false);
  const { theme, setTheme } = useThemeStore();

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
      <AccountDeletionConfirm
        isOpen={accountDeletionOpen}
        setIsOpen={setAccountDeletionOpen}
      />
      <Popover>
        <PopoverTrigger asChild title="User settings">
          <Avatar>
            <AvatarImage src={user.avatarUrl ?? ""} />
            <AvatarFallback>
              <User size="1rem" />
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent align="end" className="grid w-auto min-w-52 gap-4">
          <div className="flex max-w-min gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
              <AvatarFallback>
                <User size="3rem" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid w-full gap-2">
            <a
              href="/logout"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "relative",
              )}
            >
              <LogOut className="absolute left-4 mr-2 size-4" />
              <span>Logout</span>
            </a>
            <Button
              variant="destructive"
              onClick={() => setAccountDeletionOpen(true)}
              className="relative"
            >
              <Trash className="absolute left-4 mr-2 size-4" />
              <span>Delete Account</span>
            </Button>
          </div>

          <ToggleGroup
            id="default-weight"
            className="w-full"
            type="single"
            value={theme}
            onValueChange={(value) => {
              if (!value) return;
              setTheme(value as Theme);
            }}
          >
            {themeOptions.map((t) => (
              <ToggleGroupItem
                key={t.value}
                value={t.value}
                title={t.name}
                className={cn("transition-all", t.value === theme && "flex-1")}
              >
                <span>{t.icon}</span>
                <span
                  className={cn(
                    "w-0 overflow-hidden",
                    t.value === theme && "ml-2 w-auto",
                  )}
                >
                  {t.name}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default UserAvatar;
