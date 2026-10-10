import Image from "next/image";

interface Props {
  hotelName: string;
  tagline: string;
  image: string;
}

export default function Hero({ hotelName, tagline, image }: Props) {
  return (
    <section className="relative isolate flex h-[60vh] max-h-[640px] min-h-80 items-center justify-center overflow-hidden bg-ink">
      {image && (
        <>
          <Image
            src={image}
            alt={`Photo of ${hotelName}`}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
          {/* Darkens the photo so the white text always stays readable */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/45" />
        </>
      )}

      <div className="px-4 text-center text-white">
        <h1 className="text-4xl font-bold tracking-wide md:text-6xl">
          {hotelName}
        </h1>
        {tagline && (
          <p className="mt-3 text-lg text-gray-100 md:text-xl">{tagline}</p>
        )}
      </div>
    </section>
  );
}