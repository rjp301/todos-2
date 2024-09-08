import type { UseQueryResult } from "@tanstack/react-query";
import Loader from "@/app/components/base/loader";
import Placeholder from "@/app/components/base/placeholder";
import ErrorDisplay from "@/app/components/base/error";
import React from "react";

type Props = React.PropsWithChildren<{
  query: UseQueryResult<any[] | undefined>;
  placeholder?: string;
}>;

const ArrayQueryGuard: React.FC<Props> = (props) => {
  const { query, children, placeholder } = props;

  if (query.isLoading) return <Loader />;
  if (query.isError) return <ErrorDisplay error={query.error} />;
  if (query.isSuccess && query.data?.length === 0)
    return <Placeholder message={placeholder || "No items"} />;

  return children;
};

export default ArrayQueryGuard;
