import { useParams } from "react-router-dom";

export default function useListId(): string {
  const params = useParams();
  if ("listId" in params && params.listId) return params.listId;
  return "";
}
