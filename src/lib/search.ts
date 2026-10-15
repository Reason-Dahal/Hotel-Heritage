// Lowercase, strip Latin accents, trim. Other scripts (like Devanagari) are left intact.
export function normalizeText(value: string): string {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }
  
  // Every word typed must appear somewhere in the item's text
  export function matchesQuery(
    query: string,
    ...fields: (string | undefined)[]
  ): boolean {
    const words = normalizeText(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return true;
  
    const haystack = normalizeText(fields.filter(Boolean).join(" "));
    return words.every((word) => haystack.includes(word));
  }