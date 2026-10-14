import Link from "next/link";
import HeaderNav from "./HeaderNav";
import NewsTicker from "./NewsTicker";

interface Props {
  hotelName: string;
  tickerMessages: string[];
}

export default function Header({ hotelName, tickerMessages }: Props) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 text-center">
        <Link
          href="/"
          className="inline-block text-2xl font-bold tracking-wide text-gray-900 md:text-3xl"
        >
          {hotelName}
        </Link>
      </div>
      <NewsTicker messages={tickerMessages} />
      <HeaderNav />
    </header>
  );
}