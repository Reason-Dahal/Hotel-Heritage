"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const INTERVAL_MS = 6000;

export default function MessageBanner({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (messages.length < 2 || paused || reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [messages.length, paused, reduceMotion]);

  // The list can shrink when the admin edits it, so never trust a stale index
  const current = index % messages.length;

  return (
    <section
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="border-y border-brand-100 bg-brand-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-5 text-center md:py-7">
        {/* All messages share one grid cell, so the banner is always as tall
            as the longest message and the page below never jumps */}
       <div className="grid grid-cols-1">
          {messages.map((message, i) => (
            <p
            key={i}
            className={`col-start-1 row-start-1 break-words text-center text-lg font-semibold text-brand-800 md:text-2xl ${
              i === current ? "" : "invisible"
            }`}
          >
            {message}
          </p>

          ))}
        </div>

        {messages.length > 1 && (
          <div className="mt-2 flex justify-center">
            {messages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show message ${i + 1} of ${messages.length}`}
                aria-current={i === current}
                onClick={() => setIndex(i)}
                className="p-2"
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full ${
                    i === current ? "bg-brand-700" : "bg-brand-400/50"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}