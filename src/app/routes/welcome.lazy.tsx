import { createLazyFileRoute } from "@tanstack/react-router";
import { Feather } from "lucide-react";
import LoginButton from "../components/login-button";

export const Route = createLazyFileRoute("/welcome")({
  component: () => (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-screen-sm flex-col gap-6 px-4 pt-[10vh]">
      <div className="flex items-center justify-center">
        <Feather size="5rem" className="text-primary" />
      </div>
      <section className="prose w-full max-w-none text-center dark:prose-invert prose-h1:mb-2 prose-h1:text-5xl">
        <h1 className="">PackLighter</h1>
        <p className="">The packing list tool of champions</p>
      </section>
      <section className="flex flex-col gap-2">
        <LoginButton className="w-full" provider="google" />
        <LoginButton className="w-full" provider="github" />
      </section>
    </main>
  ),
});
