import Link from "next/link";
import HeaderNav from "./HeaderNav";

interface Props {
  hotelName: string;
  tagline: string;
}

export default function Header({ hotelName, tagline }: Props) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 text-center">
        <Link href="/" className="inline-block">
          <span className="block text-2xl font-bold tracking-wide text-gray-900 md:text-3xl">
            {hotelName}
          </span>
          {tagline && (
            <span className="mt-0.5 block text-xs uppercase tracking-widest text-gray-500">
              {tagline}
            </span>
          )}
        </Link>
      </div>
      <HeaderNav />
    </header>
  );
}