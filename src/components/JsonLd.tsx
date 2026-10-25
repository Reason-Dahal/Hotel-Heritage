export default function JsonLd({ data }: { data: Record<string, unknown> }) {
    // "<" is escaped so no text in the data can close the script tag early
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
    );
  }