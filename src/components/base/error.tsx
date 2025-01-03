import { Button } from "@radix-ui/themes";
import { Bug } from "lucide-react";
import React from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

interface Props {
  error?: Error | null;
  showGoHome?: boolean;
  retry?: () => void;
}

const ErrorDisplay: React.FC<Props> = (props) => {
  const routeError = useRouteError();
  const { showGoHome, retry, error = routeError } = props;

  console.error(error);

  let status = 500;
  let message = "An unknown error occurred. Please try again later.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText;
  }

  if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="flex h-full max-h-[50%] w-full max-w-sm flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-4">
          <Bug size="3rem" className="text-primary flex-shrink-0" />
          <div className="flex flex-col">
            <h2 className="text-lg mr-2 font-bold">
              <span className="">{status} Error</span>
            </h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {retry && <Button onClick={() => retry()}>Retry</Button>}
          {showGoHome && (
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
