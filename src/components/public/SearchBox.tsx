interface Props {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  }
  
  export default function SearchBox({ id, label, placeholder, value, onChange }: Props) {
    return (
      <div role="search" className="relative">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
  
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(e) => onChange(e.target.value)}
          // Enter closes the phone keyboard so the results are visible
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-11 pr-11 text-base text-gray-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30 [&::-webkit-search-cancel-button]:appearance-none"
        />
  
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-800"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
    );
  }