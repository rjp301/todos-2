import React from "react";
import invariant from "tiny-invariant";
import { useEventListener } from "usehooks-ts";

export default function useScrollShadow() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const element = listRef.current;
    invariant(element, "Element is not defined");

    if (element.scrollTop > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEventListener("scroll", handleScroll, listRef);

  return { listRef, isScrolled };
}
