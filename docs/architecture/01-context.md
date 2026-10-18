# System Context Diagram (C4 Level 1)

The highest-level view of the Hotel Website: who uses it and which outside
services it depends on. No internal detail yet. See `02-container.md` for the
next zoom level.

```mermaid
flowchart TB
    visitor["👤 Website Visitor<br/>Browses rooms, menu, gallery, location"]
    admin["👤 Hotel Admin<br/>Manages all site content"]

    hotelSite["🏨 Hotel Website System<br/>Public site + admin panel<br/>Next.js on Vercel"]

    mongo["🗄️ MongoDB Atlas<br/>Database service"]
    cloudinary["☁️ Cloudinary<br/>Photo storage and delivery"]
    maps["🗺️ Google Maps<br/>Embedded location map"]
    whatsapp["💬 WhatsApp<br/>Visitors message the hotel"]

    visitor -->|"views pages, searches menu and rooms"| hotelSite
    admin -->|"logs in, edits content, uploads photos"| hotelSite
    hotelSite -->|"reads and writes content"| mongo
    hotelSite -->|"stores and shows photos"| cloudinary
    hotelSite -->|"embeds the map"| maps
    hotelSite -.->|"Book now links open a chat"| whatsapp
    visitor -.->|"sends the booking message"| whatsapp

    style hotelSite fill:#4A90D9,color:#fff
    style visitor fill:#e8e8e8,color:#000
    style admin fill:#e8e8e8,color:#000
    style mongo fill:#7ED321,color:#000
    style cloudinary fill:#F5A623,color:#000
    style maps fill:#F5A623,color:#000
    style whatsapp fill:#e8e8e8,color:#000
```

## Reading this diagram

- Solid arrows are real integrations. Dotted arrows are links only: the site
  never talks to WhatsApp itself, it gives the visitor a pre-filled chat link.
- Online booking, food ordering, payments, and reports (future phases) will add
  new outside systems here, for example a payment gateway, without changing the
  rest of the diagram.
