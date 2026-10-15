import Image from "next/image";
import Price from "./Price";
import type { MenuItemDTO } from "@/types/content";

interface Props {
  item: MenuItemDTO;
  currency: string;
  sizes?: string;
  expanded?: boolean; // show the full description (on tablets and up when compact)
  compact?: boolean; // smaller layout on phones
}

export default function DishCard({
  item,
  currency,
  sizes = "(min-width: 640px) 320px, 288px",
  expanded = false,
  compact = false,
}: Props) {
  const clamp = expanded
    ? compact
      ? "line-clamp-2 sm:line-clamp-none"
      : ""
    : "line-clamp-2";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative aspect-[4/3] bg-gray-100">
        {item.images[0] ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No photo
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-2.5 sm:p-4" : "p-4"}`}>
        {item.category && (
          <p
            className={`font-semibold uppercase tracking-wider text-brand-700 ${
              compact ? "text-[10px] sm:text-xs" : "text-xs"
            }`}
          >
            {item.category}
          </p>
        )}
        <h3
          className={`break-words font-semibold text-gray-900 ${
            compact
              ? "mt-0.5 line-clamp-2 text-sm leading-snug sm:mt-1 sm:line-clamp-none sm:text-lg"
              : "mt-1 text-lg"
          }`}
        >
          {item.name}
        </h3>
        {item.description && (
          <p
            className={`mt-1 break-words text-gray-600 ${
              compact ? "text-xs sm:text-sm" : "text-sm"
            } ${clamp}`}
          >
            {item.description}
          </p>
        )}
        <div className={`mt-auto ${compact ? "pt-2 sm:pt-3" : "pt-3"}`}>
          <Price
            price={item.price}
            discountPercent={item.discountPercent}
            currency={currency}
            compact={compact}
          />
        </div>
      </div>
    </article>
  );
}