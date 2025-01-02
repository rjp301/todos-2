import { cn } from "@/lib/utils";
import React from "react";

import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@radix-ui/themes";

const authProviders: Record<
  string,
  { name: string; url: string; icon: React.ReactNode; className?: string }
> = {
  github: {
    name: "GitHub",
    url: "/login/github",
    icon: <FaGithub className="mr-2 h-5 w-5" />,
    className:
      "bg-gray-900 text-white hover:bg-gray-800 border border-gray-700 shadow",
  },
  google: {
    name: "Google",
    url: "/login/google",
    icon: <FcGoogle className="mr-2 h-5 w-5" />,
    className:
      "bg-white text-black hover:bg-gray-100 shadow border border-gray-300",
  },
};

type Props = {
  className?: string;
  provider: keyof typeof authProviders;
};

const LoginButton: React.FC<Props> = (props) => {
  const { className, provider } = props;
  const authProvider = authProviders[provider];
  return (
    <Button size="3" color="gray" variant="surface" asChild>
      <a
        className={cn("relative", authProvider.className, className)}
        href={authProvider.url}
      >
        <span className="absolute left-6">{authProvider.icon}</span>
        <span>Continue with {authProvider.name}</span>
      </a>
    </Button>
  );
};

export default LoginButton;
