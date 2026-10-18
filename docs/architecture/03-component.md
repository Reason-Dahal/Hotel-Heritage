# Component Diagram: Admin Panel and API (C4 Level 3)

Zooms into the admin panel, API routes, and authentication containers from
`02-container.md`. The public website has its own diagram in
`04-component-public.md`.

```mermaid
flowchart TB
    subgraph browser["Admin browser"]
        managers["Manager components<br/>forms and tables for each content type"]
        hook["useAdminCrud hook<br/>save, remove, reorder<br/>sends to login on a 401"]
        uploader["ImageUploader<br/>checks type and size<br/>uploads one photo at a time"]
    end

    subgraph serverPages["Admin pages (server)"]
        adminPages["Dashboard, Rooms, Menu, Categories,<br/>Notices, Gallery, Settings<br/>read content directly"]
        panelLayout["Panel layout<br/>checks the session again"]
    end

    guard["Route guard (middleware)<br/>/admin needs a session<br/>uses the edge-safe config only"]

    subgraph authBox["Authentication"]
        authConfig["auth.config.ts<br/>edge-safe rules"]
        authFull["auth.ts<br/>login check with bcrypt"]
        nextauth["/api/auth/[...nextauth]<br/>login, session, logout"]
        requireAdmin["requireAdmin()<br/>401 when there is no session"]
    end

    subgraph apiRoutes["API routes"]
        rooms["/api/rooms and /:id<br/>list, create, update, delete"]
        menu["/api/menu and /:id<br/>checks the category exists"]
        notices["/api/notices and /:id<br/>public list shows active only"]
        categories["/api/categories, /:id, /reorder<br/>unique names, blocked while in use"]
        gallery["/api/gallery, /:id, /reorder<br/>max 30, Cloudinary photos only"]
        settings["/api/settings<br/>public read, admin save"]
        uploadSign["/api/upload/sign<br/>admin-only upload signature"]
    end

    subgraph shared["Shared server code"]
        validation["validation.ts<br/>Zod schemas for every request body"]
        catRules["categories.ts<br/>case-insensitive name check"]
        revalidate["revalidatePublicSite()<br/>refreshes the public pages"]
        dbConn["connectDB()<br/>one cached connection"]
    end

    models["Mongoose models<br/>Room, MenuItem, Category, Notice,<br/>GalleryImage, SiteSettings, Admin"]

    mongo["🗄️ MongoDB Atlas"]
    cloudinary["☁️ Cloudinary"]
    publicPages["Public pages<br/>(see 04-component-public.md)"]

    adminPages --> managers
    managers --> hook
    managers --> uploader
    hook -->|"JSON requests"| apiRoutes
    uploader -->|"asks for a signature"| uploadSign
    uploader -->|"sends the photo, signed"| cloudinary

    guard --> authConfig
    guard -->|"lets in only with a session"| adminPages
    panelLayout --> authFull
    nextauth --> authFull
    requireAdmin --> authFull
    authFull -->|"looks up the admin"| models

    apiRoutes -.->|"every write"| requireAdmin
    apiRoutes -->|"checks the request body"| validation
    categories --> catRules
    apiRoutes --> dbConn
    apiRoutes --> models
    apiRoutes -->|"after a successful change"| revalidate
    revalidate -->|"refreshes"| publicPages
    adminPages -->|"reads content"| models

    dbConn --> mongo
    models --> mongo

    style browser fill:#eef4fc,stroke:#4A90D9
    style serverPages fill:#eaf6f4,stroke:#2E7D9A
    style authBox fill:#fbeefb,stroke:#D96ADB
    style apiRoutes fill:#f4eefc,stroke:#7B61FF
    style shared fill:#f3f5f7,stroke:#8895A7
    style guard fill:#D96ADB,color:#fff
    style requireAdmin fill:#D96ADB,color:#fff
    style models fill:#7ED321,color:#000
    style mongo fill:#4A90D9,color:#fff
    style cloudinary fill:#F5A623,color:#000
    style publicPages fill:#e8e8e8,color:#000
```

## Rules for anyone writing code here

- **Every write handler starts with `requireAdmin()`.** Public `GET` handlers
  are the only routes without it. The upload signature route counts as a write.
- **Validate before touching the database.** Parse the body with the matching
  Zod schema and return `400` with field errors on failure. Updates use
  `.partial()`, and the schemas have no `.default()` on purpose (ADR 0006).
- **Refresh the public site after a change.** Call `revalidatePublicSite()`
  after the database change succeeds and just before returning success, never
  before validation or on a failed request.
- **New admin pages must live under `src/app/admin/(panel)/`.** Admin pages
  read data directly instead of through the API, so they rely on the route
  guard and the panel layout's session check for protection. A page placed
  outside `(panel)` would skip both.
- **Business rules live in the API.** Categories cannot be deleted while menu
  items use them, category names are unique ignoring capital letters, the
  gallery holds at most 30 photos and only accepts Cloudinary addresses.
- **Auth config is split on purpose.** `auth.config.ts` runs at the edge and
  must stay free of bcrypt and database code (ADR 0007).
