"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import type { PublicNotice } from "@/types/content";

const STORAGE_KEY = "dismissed-notices";
const MAX_VISIBLE_LAYERS = 3;

const noopSubscribe = () => () => {};

function readDismissed(): string[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

function writeDismissed(keys: string[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // Storage can be blocked (private mode); the popup still works for this page view
  }
}

export default function NoticePopup({ notices }: { notices: PublicNotice[] }) {
  // false on the server and during hydration, true afterwards, so the
  // popup never appears in the server HTML
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const gone = new Set(hydrated ? [...readDismissed(), ...dismissed] : []);
  const visible = hydrated ? notices.filter((n) => !gone.has(n.key)) : [];
  const open = visible.length > 0;

  // Lock page scroll, move focus into the dialog, and restore focus afterwards
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const top = visible[0];
  const behind = Math.min(visible.length, MAX_VISIBLE_LAYERS) - 1;

  const dismiss = (keys: string[]) => {
    setDismissed((prev) => [...prev, ...keys]);
    writeDismissed([...readDismissed(), ...keys]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      dismiss([top.key]);
      return;
    }
    if (e.key !== "Tab") return;

    // Keep keyboard focus inside the dialog
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>("button");
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss([top.key]);
      }}
    >
      <div className="relative isolate mb-4 w-full max-w-md">
        {/* Decorative layers: the "stack" of notices waiting behind the top one */}
        {Array.from({ length: behind }, (_, i) => behind - i).map((n) => (
          <div
            key={n}
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{ transform: `translateY(${n * 10}px) scale(${1 - n * 0.04})` }}
          />
        ))}

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-title"
          aria-describedby="notice-message"
          tabIndex={-1}
          className="relative max-h-[85vh] overflow-y-auto rounded-lg bg-white shadow-xl outline-none"
        >
          <div key={top.key}>
            {top.image && (
              <div className="relative aspect-[16/9] bg-gray-100">
                <Image
                  src={top.image}
                  alt={top.title}
                  fill
                  sizes="(min-width: 448px) 448px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 id="notice-title" className="text-xl font-bold text-gray-900">
                {top.title}
              </h2>
              <p
                id="notice-message"
                className="mt-2 whitespace-pre-line text-gray-700"
              >
                {top.message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-3">
            <p className="text-xs text-gray-500" aria-live="polite">
              {visible.length > 1
                ? `${visible.length - 1} more ${visible.length === 2 ? "notice" : "notices"}`
                : ""}
            </p>
            <div className="flex items-center gap-3">
              {visible.length > 1 && (
                <button
                  type="button"
                  onClick={() => dismiss(visible.map((n) => n.key))}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Dismiss all
                </button>
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={() => dismiss([top.key])}
                className="rounded bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
              >
                {visible.length > 1 ? "Next" : "Close"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}