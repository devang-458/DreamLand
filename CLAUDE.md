# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DreamLand is a SaaS project built with React Router 7, featuring server-side rendering (SSR), TypeScript, and TailwindCSS v4.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server with HMR (localhost:5173)
npm run build        # Create production build
npm run start        # Run production server
npm run typecheck    # Run TypeScript type checking
```

## Architecture

- **Framework**: React Router 7 with SSR enabled by default
- **Styling**: TailwindCSS v4 (configured via Vite plugin)
- **Path aliases**: `~/*` maps to `./app/*`

### File Structure

```
app/
  routes.ts          # Route configuration (single source of truth for routes)
  root.tsx           # Root layout with error boundary
  routes/home.tsx    # Home page route
  app.css            # Global styles
components/
  Navbar.tsx         # Shared UI components
```

### Key Patterns

- **Routes**: Defined in `app/routes.ts` using the `RouteConfig` API
- **Route files**: Export `meta`, loaders, actions, and default component
- **Type safety**: Generated types available via `./+types/*` imports
- **Component organization**: Shared UI components live in `/components` at project root

### Docker

Multi-stage build in `Dockerfile` produces a production image. Deploy to any Docker-compatible platform (AWS ECS, Cloud Run, Fly.io, etc.).
