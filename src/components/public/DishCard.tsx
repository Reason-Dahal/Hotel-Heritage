import Image from "next/image";
import Price from "./Price";
import type { MenuItemDTO } from "@/types/content";

export default function DishCard({ item, currency }: { item: MenuItemDTO; currency: string }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative aspect-[4/3] bg-gray-100">
        {item.images[0] ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="(min-width: 640px) 320px, 288px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No photo
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {item.category && (
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            {item.category}
          </p>
        )}
        <h3 className="mt-1 text-lg font-semibold text-gray-900">{item.name}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>
        )}
        <div className="mt-auto pt-3">
          <Price price={item.price} discountPercent={item.discountPercent} currency={currency} />
        </div>
      </div>
    </article>
  );
}