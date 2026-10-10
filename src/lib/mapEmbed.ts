// Accepts a plain URL, or the full <iframe ...> HTML that Google Maps provides
export function extractMapSrc(input: string): string {
    const value = input.trim();
    const match = value.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    return (match ? match[1] : value).trim();
  }