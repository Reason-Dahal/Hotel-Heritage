export function discountedPrice(price: number, discountPercent: number) {
    return Math.round(price * (100 - discountPercent)) / 100;
  }
  
  export function formatPrice(amount: number, currency: string) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  }