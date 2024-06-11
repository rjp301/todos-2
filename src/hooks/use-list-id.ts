export default function useListId() {
  const pathname = new URL(window.location.href).pathname;
  const segments = pathname.split("/");
  if (segments[0] === "list") {
    return segments[1];
  }
  return "";
}
