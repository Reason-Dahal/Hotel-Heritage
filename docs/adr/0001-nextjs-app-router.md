# 0001. Use Next.js with App Router

## Status
Accepted

## Context
The project's top priority is SEO. The developer has prior experience with
Node.js and some React, but no prior Next.js experience. The frontend and
backend (admin API) both need to live in one deployable project to keep
hosting simple and free-tier friendly. We also need this architecture to
support future features (booking, food ordering, payments) without a
framework change.

Within Next.js, we additionally chose the **App Router** (introduced in
Next.js 13+) over the older Pages Router.

## Decision
Use Next.js (App Router) as a single full-stack framework, handling both
the public site (via Server-Side Rendering / Static Site Generation) and
the admin backend (via API Routes), deployed as one Vercel project.

## Alternatives Considered
- **WordPress + plugins**: faster initial build, mature SEO plugins, but
  poor fit for a fully custom admin data model (rooms/menu with discounts)
  and harder to extend into custom booking/payment flows later.
- **Plain React (CRA/Vite) + separate Node/Express backend**: client-side
  rendering by default is worse for SEO out of the box, and requires
  managing two separate deployments instead of one.
- **Next.js Pages Router**: still supported, but the App Router's built-in
  Metadata API gives cleaner per-page SEO tag control, which directly
  serves the top project priority.

## Consequences
- Positive: SSR/SSG improves SEO and initial load performance; one
  codebase and one deployment; built-in image optimization via
  `next/image`; clear growth path for future features via new routes.
- Negative: Developer must learn App Router conventions (Server vs Client
  Components, `layout.js`, Route Handlers) with no prior Next.js
  experience — mitigated by the step-by-step SDLC approach and dedicated
  learning time during Phase 3.
