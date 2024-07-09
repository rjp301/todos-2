import {
  useQueryClient,
  type QueryKey,
  type Updater,
} from "@tanstack/react-query";

export default function useOverwriteQueryCache<T>() {
  const queryClient = useQueryClient();
  const overwriteQueryCache = (
    queryKey: QueryKey,
    updater: Updater<T | undefined, T>,
  ) => {
    queryClient.setQueryData<T>(queryKey, updater);
  };

  return overwriteQueryCache;
}
