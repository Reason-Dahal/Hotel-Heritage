# Container Diagram (C4 Level 2)

Opens up the "Hotel Website System" box from `01-context.md` and shows the
major pieces running inside it. The next zoom level is split in two:
`03-component.md` (admin panel and API) and `04-component-public.md` (public
website).

```mermaid
flowchart TB
    visitor["👤 Website Visitor"]
    admin["👤 Hotel Admin"]

    subgraph vercel["🟦 Vercel (hosting)"]
        publicSite["Public website<br/>Server-rendered pages: Home, Rooms, Menu<br/>Header, footer, notice popup"]
        adminPanel["Admin panel<br/>Dashboard and management pages<br/>Rooms, Menu, Categories, Notices,<br/>Gallery, Settings"]
        api["API routes<br/>Create, update, delete content<br/>Upload signature"]
        auth["Authentication<br/>NextAuth login and sessions<br/>Route guard for /admin"]
        data["Data access<br/>Mongoose models and read helpers<br/>shared by pages and API"]
        cache["Page cache<br/>Pages are pre-built and refreshed<br/>after every admin change"]
    end

    mongo["🗄️ MongoDB Atlas"]
    cloudinary["☁️ Cloudinary"]
    maps["🗺️ Google Maps"]
    whatsapp["💬 WhatsApp"]

    visitor -->|"browses"| publicSite
    admin -->|"logs in, manages content"| adminPanel

    publicSite -->|"pre-built and kept in"| cache
    publicSite -->|"reads content"| data
    adminPanel -->|"reads current content"| data
    adminPanel -->|"saves changes"| api
    api -->|"reads and writes"| data
    api -->|"refreshes pages after a change"| cache

    adminPanel -->|"session check"| auth
    api -->|"session check on every write"| auth
    auth -->|"verifies the admin account"| data

    data -->|"queries"| mongo
    adminPanel -->|"uploads photos, signed"| cloudinary
    publicSite -->|"shows photos"| cloudinary
    publicSite -->|"embeds the map"| maps
    publicSite -.->|"Book now link"| whatsapp

    style vercel fill:#eef4fc,stroke:#4A90D9
    style publicSite fill:#4A90D9,color:#fff
    style adminPanel fill:#2E7D9A,color:#fff
    style api fill:#7B61FF,color:#fff
    style auth fill:#D96ADB,color:#fff
    style data fill:#5FA8A0,color:#fff
    style cache fill:#8895A7,color:#fff
    style mongo fill:#7ED321,color:#000
    style cloudinary fill:#F5A623,color:#000
    style maps fill:#F5A623,color:#000
    style whatsapp fill:#e8e8e8,color:#000
    style visitor fill:#e8e8e8,color:#000
    style admin fill:#e8e8e8,color:#000
```

## Reading this diagram

- **Pages read data directly, writes go through the API.** Public and admin
  pages are rendered on the server and read content through the shared data
  access layer. Only changes (create, update, delete, reorder, upload
  signature) travel through API routes. This replaces the Phase 2 rule that
  "everything goes through the API"; the reasoning is in ADR 0011.
- **Browser code never touches the database or the secrets.** Client
  components only call API routes. Uploads go from the admin's browser straight
  to Cloudinary, using a signature the API issues after checking the session.
- **The cache is why edits show up instantly.** Public pages are pre-built for
  speed. Every successful admin change triggers a refresh, and pages also
  refresh at least hourly as a safety net.
- **Because pages skip the API for reads, they must protect themselves.** Admin
  pages are guarded by the route guard and by a second session check in the
  panel layout.

## For future upgrades

Booking, ordering, and payments will add new API routes, new collections in the
data layer, and one or two new outside systems at this level. Nothing drawn
here needs restructuring.
