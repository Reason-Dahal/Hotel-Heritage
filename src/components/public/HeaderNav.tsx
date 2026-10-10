"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/menu", label: "Menu" },
  { href: "/#contact", label: "Contact" },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : !href.includes("#") && pathname.startsWith(href);

  return (
    <nav aria-label="Main navigation" className="border-t border-gray-100">
      <div className="flex justify-center md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((o) => !o)}
          className="p-3 text-gray-700"
        >
          <span className="sr-only">
            {open ? "Close navigation" : "Open navigation"}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <ul
        id="main-menu"
        className={`${open ? "flex" : "hidden"} flex-col items-center pb-3 md:flex md:flex-row md:justify-center md:gap-8 md:pb-0`}
      >
        {links.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block px-3 py-2 text-sm font-medium md:py-3 ${
                  active
                    ? "text-amber-700"
                    : "text-gray-700 hover:text-amber-700"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}