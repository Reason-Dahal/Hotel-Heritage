interface Props {
    chips: { id: string; name: string }[];
    enabled: ReadonlySet<string>;
  }
  
  const chipBase = "block whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm";
  
  export default function CategoryChips({ chips, enabled }: Props) {
    return (
      <nav aria-label="Menu categories" className="mt-2">
        <ul className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {chips.map(({ id, name }) => (
            <li key={id} className="shrink-0">
              {enabled.has(id) ? (
                <a
                  href={`#${id}`}
                  className={`${chipBase} border-gray-300 bg-white font-medium text-gray-700 hover:border-brand-700 hover:text-brand-700`}
                >
                  {name}
                </a>
              ) : (
                // No matches for this category in the current search
                <span
                  aria-disabled="true"
                  className={`${chipBase} border-gray-200 text-gray-400`}
                >
                  {name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  }