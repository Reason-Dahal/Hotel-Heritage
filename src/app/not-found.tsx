import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="public-theme flex min-h-screen items-center justify-center px-4 py-16 text-center">
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-3 text-gray-600">
          The page you are looking for does not exist or has moved.
        </p>
        <nav
          aria-label="Helpful links"
          className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-semibold text-brand-700"
        >
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/rooms" className="hover:underline">Rooms</Link>
          <Link href="/menu" className="hover:underline">Menu</Link>
        </nav>
      </div>
    </main>
  );
}