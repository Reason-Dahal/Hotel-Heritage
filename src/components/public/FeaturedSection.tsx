import Link from "next/link";

interface Props {
  id: string;
  title: string;
  seeAllHref: string;
  seeAllLabel: string;
  children: React.ReactNode;
}

export default function FeaturedSection({ id, title, seeAllHref, seeAllLabel, children }: Props) {
  return (
    <section aria-labelledby={`${id}-heading`} className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <h2 id={`${id}-heading`} className="text-2xl font-bold text-gray-900 md:text-3xl">
          {title}
        </h2>
        <Link href={seeAllHref} className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
          {seeAllLabel} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}