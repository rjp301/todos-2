import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import ErrorDisplay from "@/components/base/error";
import HomePage from "@/app/home-page";
import ListPage from "@/app/list-page";
import Root from "@/app/root";
import RadixProvider from "@/components/base/radix-provider";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorDisplay />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "list/:listId",
        element: <ListPage />,
      },
    ],
  },
]);

// Render the app
const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <RadixProvider>
      <TooltipProvider>
        <Toaster />
        <RouterProvider router={router} />
      </TooltipProvider>
    </RadixProvider>
  </QueryClientProvider>
);

export default App;
