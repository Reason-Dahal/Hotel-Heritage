"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SECONDS_PER_CHARACTER = 0.15;
const MIN_SECONDS = 20;

// Full width on phones. On laptops it becomes a centered bar about as wide as
// the nav links. To change the laptop width, change md:max-w-md
// (try md:max-w-sm for narrower or md:max-w-lg for wider).
const WRAPPER =
  "bg-brand-700 text-white md:mx-auto md:my-2 md:max-w-md md:overflow-hidden md:rounded-md";

export default function NewsTicker({ messages }: { messages: string[] }) {
  const reduceMotion = usePrefersReducedMotion();

  if (messages.length === 0) return null;

  // Visitors who asked for less motion get a still, wrapping list
  if (reduceMotion) {
    return (
      <div role="region" aria-label="Latest announcements" className={WRAPPER}>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-1 px-4 py-2 text-center text-sm font-medium">
          {messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </div>
    );
  }

  const characters = messages.reduce((total, m) => total + m.length, 0);
  const duration = Math.max(MIN_SECONDS, characters * SECONDS_PER_CHARACTER);

  // The second, identical group is what makes the loop seamless;
  // it is hidden from screen readers so the messages are read once
  const group = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="ticker-group flex min-w-full shrink-0 items-center justify-around"
    >
      {messages.map((message, i) => (
        <li key={i} className="whitespace-nowrap px-8">
          {message}
        </li>
      ))}
    </ul>
  );

  return (
    <div role="region" aria-label="Latest announcements" className={WRAPPER}>
      <div
        style={{ "--ticker-duration": `${duration}s` } as React.CSSProperties}
        className="ticker flex overflow-hidden py-2 text-sm font-medium"
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}