"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { GalleryImageDTO } from "@/types/content";

const AUTOPLAY_MS = 5000;
const MAX_DOTS = 10;

const arrowClass =
  "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow hover:text-brand-700 md:flex";

interface Props {
  images: GalleryImageDTO[];
  label: string;
  hotelName: string;
}

export default function GallerySlider({ images, label, hotelName }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const currentRef = useRef(0);
  const [current, setCurrent] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [inView, setInView] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const count = images.length;
  const canAutoplay = !reduceMotion && count > 1;
  const playing = canAutoplay && !userPaused && !hovering && !keyboardFocus && inView;

  const goTo = useCallback(
    (index: number) => {
      const el = trackRef.current;
      if (!el) return;
      // Long jumps (wrapping to the start, or a dot far away) are instant,
      // so the slider never races back across every photo
      const farJump = Math.abs(index - currentRef.current) > 1;
      el.scrollTo({
        left: index * el.clientWidth,
        behavior: reduceMotion || farJump ? "auto" : "smooth",
      });
    },
    [reduceMotion]
  );

  // Keeps `current` in step with swipes, arrow keys, and programmatic scrolling
  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== currentRef.current) {
      currentRef.current = index;
      setCurrent(index);
    }
  };

  // Only run while the gallery is actually on screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The timer restarts after every change (automatic or manual), so after a
  // swipe or click the visitor always gets a full interval before it moves on
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => goTo((current + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [playing, current, count, goTo]);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(e) => {
        // Touch taps emit a pointerenter that never "leaves", so only a mouse pauses
        if (e.pointerType === "mouse") setHovering(true);
      }}
      onPointerLeave={() => setHovering(false)}
      onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
      onBlur={() => setKeyboardFocus(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <ul
          ref={trackRef}
          onScroll={handleScroll}
          tabIndex={0}
          aria-live={playing ? "off" : "polite"}
          aria-label={`${label} (use the left and right arrow keys to browse)`}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => {
            const caption = image.alt.trim();

            return (
              <li
                key={image._id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== current || undefined}
                className="relative aspect-[4/3] w-full shrink-0 snap-center bg-gray-100 sm:aspect-[16/9] lg:aspect-auto lg:h-[30rem]"
              >
                <Image
                  src={image.url}
                  alt={caption || `${hotelName} photo ${i + 1}`}
                  fill
                  sizes="(min-width: 1152px) 1120px, 100vw"
                  className="object-cover"
                />

                {/* The photo's alt text already tells screen readers what it shows,
                    so this visible caption is hidden from them to avoid repetition */}
                {caption && (
                  <p
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-2.5 text-center text-sm text-white sm:py-3 sm:text-base"
                  >
                    <span className="line-clamp-2 sm:line-clamp-none">{caption}</span>
                  </p>
                )}
              </li>
            ); 
          })}
        </ul>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo((current - 1 + count) % count)}
              className={`${arrowClass} left-3`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo((current + 1) % count)}
              className={`${arrowClass} right-3`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          {canAutoplay ? (
            <button
              type="button"
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              onClick={() => setUserPaused((p) => !p)}
              className="rounded-full border border-gray-300 p-2 text-gray-700 hover:text-brand-700"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {userPaused ? (
                  <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
                ) : (
                  <path d="M8 5v14M16 5v14" />
                )}
              </svg>
            </button>
          ) : (
            <span />
          )}

          {count <= MAX_DOTS && (
            <div className="flex">
              {images.map((image, i) => (
                <button
                  key={image._id}
                  type="button"
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === current}
                  onClick={() => goTo(i)}
                  className="p-2"
                >
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ${
                      i === current ? "bg-brand-700" : "bg-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}

          <p aria-hidden="true" className="text-sm text-gray-600">
            {current + 1} / {count}
          </p>
        </div>
      )}
    </div>
  );
}