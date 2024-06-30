import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Error from "@/app/components/base/error";
import { queryClient } from "./lib/client";

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: Error,
});
// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster richColors />
    <RouterProvider router={router} />
  </QueryClientProvider>
);

export default App;
