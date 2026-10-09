function finalPrice(price: number, discountPercent: number) {
    return Math.round(price * (100 - discountPercent)) / 100;
  }
  
  export default function PriceDisplay({
    price,
    discountPercent,
  }: {
    price: number;
    discountPercent: number;
  }) {
    if (discountPercent <= 0) {
      return <span className="text-gray-800">{price}</span>;
    }
  
    return (
      <>
        <span className="text-gray-400 line-through">{price}</span>{" "}
        <span className="font-semibold text-gray-800">
          {finalPrice(price, discountPercent)}
        </span>{" "}
        <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
          -{discountPercent}%
        </span>
      </>
    );
  }