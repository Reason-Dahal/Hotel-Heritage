# 0005. Host on Vercel

## Status
Accepted

## Context
The project must use free hosting, deploy from GitHub automatically, and
support Next.js well since that is the chosen framework. The developer is
new to Next.js and benefits from a hosting setup with minimal manual
configuration.

## Decision
Deploy the Next.js application on Vercel's free tier, connected directly
to the project's GitHub repository for automatic build-and-deploy on every
merge to `main`.

## Alternatives Considered
- **Render**: also free and viable, but as a general-purpose host it
  requires more manual configuration for a Next.js project specifically
  (build commands, Node version), and its free tier spins down idle
  services, causing cold-start delays on the first request after
  inactivity.
- **Netlify**: strong general static/SSR host with good free tier, but
  Vercel (built by the same team that maintains Next.js) has the most
  seamless, zero-config integration with Next.js-specific features (Image
  Optimization, Edge/Serverless Functions for API Routes, Metadata API
  previews).

## Consequences
- Positive: push-to-deploy workflow with zero manual server management;
  automatic HTTPS; built-in support for Next.js Image Optimization and API
  Routes with no extra configuration; generous free tier for a
  low-to-moderate traffic hotel site.
- Negative: vendor-specific conveniences (e.g. Image Optimization,
  Edge Functions) mean some behavior is Vercel-specific — if the project
  ever needs to migrate off Vercel, a small amount of configuration
  (not application logic) would need to be adapted for the new host.
