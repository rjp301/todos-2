export default function useIsMac() {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  return isMac;
}
