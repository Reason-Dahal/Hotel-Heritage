import Link from "next/link";
import HeaderNav from "./HeaderNav";
import NewsTicker from "./NewsTicker";

interface Props {
  hotelName: string;
  tickerMessages: string[];
}

export default function Header({ hotelName, tickerMessages }: Props) {
  return (
    <header className="header-surface">
      <div className="mx-auto max-w-6xl px-4 pt-6 text-center">
        {/* The left padding balances the letter spacing, so the name sits exactly centered */}
        <Link
          href="/"
          className="inline-block text-balance pl-[0.18em] text-xl font-semibold uppercase tracking-[0.18em] text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 md:text-2xl"
        >
          {hotelName}
        </Link>
      </div>
      <NewsTicker messages={tickerMessages} />
      <HeaderNav />
    </header>
  );
}