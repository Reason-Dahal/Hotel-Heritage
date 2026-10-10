import { discountedPrice, formatPrice } from "@/lib/price";

interface Props {
  price: number;
  discountPercent: number;
  currency: string;
  unit?: string; // e.g. "per night"
}

export default function Price({ price, discountPercent, currency, unit }: Props) {
  const hasDiscount = discountPercent > 0;
  const current = formatPrice(
    hasDiscount ? discountedPrice(price, discountPercent) : price,
    currency
  );

  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      {hasDiscount && (
        <>
          <span className="sr-only">Original price:</span>
          <s className="text-sm text-gray-500">{formatPrice(price, currency)}</s>
          <span className="sr-only">Now:</span>
        </>
      )}
      <span className="text-lg font-bold text-gray-900">{current}</span>
      {unit && <span className="text-sm text-gray-500">{unit}</span>}
      {hasDiscount && (
        <span className="rounded bg-brand-100 px-1.5 py-0.5 text-xs font-semibold text-brand-800">
          {discountPercent}% off
        </span>
      )}
    </p>
  );
}