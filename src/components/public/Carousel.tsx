"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Props {
  label: string;
  children: React.ReactNode;
}

const arrowClass =
  "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow hover:text-brand-700 disabled:opacity-30 md:flex";

export default function Carousel({ label, children }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    // ResizeObserver fires once on observe, which sets the initial state
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.9,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const scrollable = canPrev || canNext;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative">
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label={`${label} (scrollable)`}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {children}
      </ul>

      {scrollable && (
        <>
          <button
            type="button"
            aria-label={`Previous ${label}`}
            disabled={!canPrev}
            onClick={() => scrollByPage(-1)}
            className={`${arrowClass} left-2`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={`Next ${label}`}
            disabled={!canNext}
            onClick={() => scrollByPage(1)}
            className={`${arrowClass} right-2`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}