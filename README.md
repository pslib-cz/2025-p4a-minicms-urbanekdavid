# ThreadClip

Full-stack video publishing platform built with Next.js 16, PostgreSQL, and TUS resumable uploads.

## Data Model

```
User ──< VideoPost >── Category
              │
              └──< TagsOnVideos >── Tag

Account ──< User >── Session
VerificationToken
```

- **User**: auth accounts with email/password credentials
- **VideoPost**: videos with title, slug, excerpt, content, videoUrl, thumbnailUrl, status (DRAFT/PUBLISHED)
- **Category**: video categories (Technology, Music, Sports, Art, Education)
- **Tag**: many-to-many tags via TagsOnVideos junction
- **Account/Session/VerificationToken**: NextAuth.js models

## Features

- [x] Next.js 16 App Router with Server Components
- [x] PostgreSQL via Prisma 7 ORM with pg adapter
- [x] NextAuth.js v5 (credentials auth, JWT sessions)
- [x] Proxy middleware (Next.js 16 replacement for middleware.ts) protecting dashboard
- [x] TUS protocol chunked resumable uploads (pause/resume/cancel)
- [x] Tiptap rich text editor for video content
- [x] Public pages: homepage, video detail, search, category/tag filters
- [x] Dashboard: video CRUD, category management, tag management
- [x] Zod validation on all API inputs
- [x] Auth + ownership checks on all mutating API routes
- [x] CSS design system with custom properties (cinematic dark theme)
- [x] Micro-animations: scroll reveals, card hover, button interactions, skeleton loading, toast notifications, modal transitions, status badge pulse, shake on delete, tag hover fill, search spinner, underline nav links
- [x] Custom video player with seek, volume, fullscreen
- [x] Pagination (URL-based for SSR)
- [x] Debounced search with animated spinner
- [x] Cookie consent banner gating Microsoft Clarity
- [x] SEO: generateMetadata on all public pages, sitemap.xml, robots.txt
- [x] next/image optimization throughout
- [x] Responsive (mobile-first, tested at 375px/768px/1280px/1920px)
- [x] Google Fonts: Syne (display), DM Sans (body), JetBrains Mono (mono)
- [x] Seed data: 3 users, 5 categories, 15 tags, 20 videos

## Local Setup

### Prerequisites

- Node.js 20.9+
- PostgreSQL running locally

### Steps

1. Clone and install:
```bash
git clone <repo-url> threadclip
cd threadclip
npm install
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push schema to database:
```bash
npm run db:push
```

5. Seed the database:
```bash
npm run db:seed
```

6. Start development server:
```bash
npm run dev
```

7. Open http://localhost:3000

### Demo Credentials

- alice@threadclip.com / password123
- bob@threadclip.com / password123
- carol@threadclip.com / password123

## TUS Upload Architecture

ThreadClip uses the TUS (Tus Upload Server) protocol for resumable file uploads:

1. **Client** (`tus-js-client`): splits files into 5MB chunks, sends via PATCH requests
2. **Server** (`@tus/server` + `@tus/file-store`): handles POST (create), PATCH (upload chunk), HEAD (check offset)
3. **Resume**: on network failure, client checks HEAD for last offset and resumes from there
4. **Controls**: pause (abort XHR), resume (restart from offset), cancel (abort + reset)
5. **Progress**: real-time percentage, upload speed (MB/s), estimated time remaining
6. **Auth**: all upload requests authenticated via NextAuth session

Files are stored in `./uploads/` (configurable via `UPLOAD_DIR` env var). Max file size: 2GB.

## Deployment (Vercel + Neon)

1. Create a Neon PostgreSQL database
2. Push to GitHub
3. Import project in Vercel
4. Set environment variables:
   - `DATABASE_URL`: Neon connection string
   - `AUTH_SECRET`: generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_URL`: your Vercel domain
   - `NEXT_PUBLIC_CLARITY_ID`: (optional) Microsoft Clarity project ID
5. Deploy

For file uploads in production, replace `@tus/file-store` with S3-compatible storage.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to DB |
| `npm run db:seed` | Seed database |
| `npm run lint` | Run ESLint |
# 2025-p4a-minicms-urbanekdavid
# 2025-p4a-minicms-urbanekdavid
