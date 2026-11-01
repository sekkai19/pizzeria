# Project Overview: Pizzeria Website Platform

## 1. Project Purpose & Goals
A modern digital menu and management web platform tailored for pizzerias and restaurants.
The platform enables:
- Fast, mobile-first digital menus for customers accessed via restaurant-specific slugs (e.g. `/[shopSlug]`).
- Instant self-management for shop owners to update prices, item availability, and details on mobile or desktop without relying on agencies (`/[shopSlug]/admin`).
- An interactive live demo page (`/demo`) showcasing rapid menu price customization to potential restaurant clients.

## 2. Architecture & Technology Stack
- **Framework**: Next.js 16 (App Router)
- **UI & Runtime**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Icons**: Lucide React (`lucide-react`)
- **Database & ORM**: SQLite (`prisma/dev.db`), Prisma ORM 5 (`@prisma/client`, `prisma`), `better-sqlite3`
- **Authentication**: JWT session cookies using `jose` (`shop_session` HTTP-only cookie)

## 3. Directory Structure
- `prisma/`
  - `schema.prisma`: Data models for `Shop`, `Category`, and `Item`
  - `seed.js`: Seed script for demo shop "Mario's Pizza" (`slug: 'marios-pizza'`)
  - `dev.db`: SQLite database file
- `src/`
  - `app/`
    - `page.tsx`: Redirects root `/` to `/demo`
    - `layout.tsx`: Root HTML layout with Geist fonts and global styles
    - `globals.css`: Global CSS with Tailwind setup
    - `demo/page.tsx`: Interactive demo with split-screen value proposition and editable menu preview
    - `[shopSlug]/`
      - `page.tsx`: Public digital menu page for a specific shop
      - `admin/`
        - `page.tsx`: Admin route checking session authorization
        - `LoginForm.tsx`: Password login component
        - `AdminDashboard.tsx`: Dashboard for editing menu items, prices, and availability
        - `actions.ts`: Server actions for authentication and menu updates
  - `components/`
    - `ShopView.tsx`: Shared menu viewer component used in public shop views and demo mode
  - `lib/`
    - `prisma.ts`: Prisma client singleton instance
    - `auth.ts`: Session encryption, decryption, creation, and retrieval

## 4. Current State & Known Details
- Database contains models for shops, categories, and items with ordering links, images, price offers, and availability toggles.
- Standard seed includes "Mario's Pizza" (`marios-pizza`) with pizza, pasta, and drink categories.
- Git repository published to GitHub at `https://github.com/sekkai19/pizzeria`.
- Configured static export (`output: 'export'`) with `generateStaticParams` for pre-rendering public routes (`/demo`, `/marios-pizza`, `/marios-pizza/admin`).
- Configured GitHub Pages deployment from `gh-pages` branch at `https://sekkai19.github.io/pizzeria/`.
- Full-stack dynamic admin editing with SQLite persistence remains available when deployed to Node.js / Vercel platforms.
