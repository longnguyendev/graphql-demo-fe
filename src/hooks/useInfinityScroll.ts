import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

export function useInfinityScroll(fetchNextPage: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  const entry = useIntersectionObserver(ref, {});

  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      fetchNextPage();
    }
  }, [fetchNextPage, isVisible]);

  return ref;
}
