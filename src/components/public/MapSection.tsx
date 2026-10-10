const EMBED_PREFIX = "https://www.google.com/maps/embed";

interface Props {
  hotelName: string;
  address: string;
  embedUrl: string;
}

export default function MapSection({ hotelName, address, embedUrl }: Props) {
  // Checked again here, even though it was validated when saved
  if (!embedUrl.startsWith(EMBED_PREFIX)) return null;

  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : "";

  return (
    <section
      aria-labelledby="location-heading"
      className="mx-auto max-w-6xl px-4 py-12"
    >
      <h2
        id="location-heading"
        className="text-2xl font-bold text-gray-900 md:text-3xl"
      >
        Find us
      </h2>
      {address && <p className="mt-2 text-gray-600">{address}</p>}

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <iframe
          src={embedUrl}
          title={`Map showing the location of ${hotelName}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full md:h-96"
        />
      </div>

      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline"
        >
          Get directions
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </section>
  );
}