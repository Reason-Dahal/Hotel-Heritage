import { discountedPrice, formatPrice } from "@/lib/price";

interface Props {
  price: number;
  discountPercent: number;
  currency: string;
  unit?: string; // e.g. "per night"
  compact?: boolean; // smaller text on phones
}

export default function Price({
  price,
  discountPercent,
  currency,
  unit,
  compact = false,
}: Props) {
  const hasDiscount = discountPercent > 0;
  const current = formatPrice(
    hasDiscount ? discountedPrice(price, discountPercent) : price,
    currency
  );

  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:gap-x-2">
      {hasDiscount && (
        <>
          <span className="sr-only">Original price:</span>
          <s className={`text-gray-500 ${compact ? "text-xs sm:text-sm" : "text-sm"}`}>
            {formatPrice(price, currency)}
          </s>
          <span className="sr-only">Now:</span>
        </>
      )}
      <span
        className={`font-bold text-gray-900 ${compact ? "text-base sm:text-lg" : "text-lg"}`}
      >
        {current}
      </span>
      {unit && (
        <span className={`text-gray-500 ${compact ? "text-xs sm:text-sm" : "text-sm"}`}>
          {unit}
        </span>
      )}
      {hasDiscount && (
        <span
          className={`rounded bg-brand-100 px-1.5 py-0.5 font-semibold text-brand-800 ${
            compact ? "text-[10px] sm:text-xs" : "text-xs"
          }`}
        >
          {discountPercent}% off
        </span>
      )}
    </p>
  );
}