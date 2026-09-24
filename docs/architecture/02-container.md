# Container Diagram (C4 Level 2)

This zooms into the "Hotel Website System" box from the Context diagram
(`01-context.md`) and shows the major technical containers inside it, and
what each one talks to. See `03-component.md` for the next zoom level,
which opens up the API Routes container specifically.

```mermaid
flowchart TB
    visitor["👤 Website Visitor"]
    admin["👤 Hotel Admin"]

    subgraph vercel["🟦 Vercel Platform (Hosting)"]
        frontend["Next.js Frontend<br/>SSR/SSG pages<br/>Home, Menu, Rooms, Admin UI"]
        api["API Routes<br/>Business logic<br/>/api/rooms /api/menu /api/notices"]
        auth["NextAuth.js<br/>Admin authentication<br/>Session + credential check"]
    end

    mongo["🗄️ MongoDB Atlas<br/>Stores rooms, menu, notices, admin"]
    cloudinary["☁️ Cloudinary<br/>Stores & serves images"]
    maps["🗺️ Google Maps<br/>Location embed"]

    visitor -->|"browses pages"| frontend
    admin -->|"logs in, manages content"| frontend

    frontend -->|"fetches/sends data"| api
    frontend -->|"embeds location"| maps

    api -->|"validates admin session"| auth
    api -->|"reads/writes documents"| mongo
    api -->|"uploads/fetches images"| cloudinary

    style vercel fill:#eef4fc,stroke:#4A90D9
    style frontend fill:#4A90D9,color:#fff
    style api fill:#7B61FF,color:#fff
    style auth fill:#D96ADB,color:#fff
    style mongo fill:#7ED321,color:#000
    style cloudinary fill:#F5A623,color:#000
    style maps fill:#F5A623,color:#000
    style visitor fill:#e8e8e8,color:#000
    style admin fill:#e8e8e8,color:#000
```

## Reading this diagram

- **Vercel platform** (outer box) hosts three internal containers: the
  Next.js frontend, the API routes, and NextAuth's session handling.
- The **frontend never talks to MongoDB or Cloudinary directly** — every
  data operation goes through the API routes. This is a rule for coders
  to follow when implementing: no direct DB/Cloudinary calls from React
  components.
- **NextAuth** sits between the API routes and every write operation,
  checking session validity before any create/update/delete proceeds.

## Why this matters for future upgrades

Adding a Payment Gateway or a Booking/Ordering system later means adding
new containers (or external systems) at this same level — e.g. a
`Payment Gateway` external system connected to a new `/api/bookings`
route — without altering the Frontend/API/Auth structure already in
place.
