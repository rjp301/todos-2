import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { actions } from "astro:actions";

export const Route = createLazyFileRoute("/test")({
  component: () => (
    <div>
      <Button onClick={() => actions.log({ message: "Hello" })}>
        Say hello to the server
      </Button>
    </div>
  ),
});
