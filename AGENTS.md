# Link Shortener

> A simple, fast URL shortening service with analytics

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 14 (App Router) | Modern React with server components |
| Backend | Next.js API Routes | Unified codebase, edge-ready |
| Database | Neon Postgres | Serverless, auto-scaling, branching |
| Deployment | Railway | Simple deploys, good free tier |
| Analytics | Built-in | Track clicks, referrers, geo |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home - create short links
│   ├── [slug]/page.tsx       # Redirect handler
│   ├── dashboard/page.tsx    # Analytics dashboard
│   └── api/
│       ├── shorten/route.ts  # POST - create link
│       ├── links/route.ts    # GET - list user's links
│       └── stats/[id]/route.ts # GET - link analytics
├── components/
│   ├── LinkForm.tsx
│   ├── LinkList.tsx
│   └── StatsChart.tsx
├── lib/
│   ├── db.ts                 # Neon connection
│   └── utils.ts              # Slug generation, etc.
└── types/
    └── index.ts
```

## API Design

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/shorten | POST | Create short link |
| /api/links | GET | List user's links |
| /api/stats/[id] | GET | Get click analytics |
| /[slug] | GET | Redirect to original URL |

## Database Schema

```sql
-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id VARCHAR(255),  -- Optional, for authenticated users
  clicks INT DEFAULT 0
);

-- Clicks table (for detailed analytics)
CREATE TABLE clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id),
  clicked_at TIMESTAMP DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  country VARCHAR(2),
  city VARCHAR(100)
);

-- Indexes
CREATE INDEX idx_links_slug ON links(slug);
CREATE INDEX idx_clicks_link_id ON clicks(link_id);
```

## External Services

| Service | Purpose | Env Var |
|---------|---------|---------|
| Neon | Database | DATABASE_URL |
| (Optional) Resend | Email notifications | RESEND_API_KEY |

## Conventions

- Components: PascalCase (`LinkForm.tsx`)
- API routes: kebab-case folders, `route.ts` files
- Database: snake_case columns
- Slugs: 6 chars, alphanumeric (base62)
- No auth initially - add later if needed

## Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deployment

**Preview**: https://link-shortener.sha.red (dev-server)
**Production**: TBD (Railway)

### Dev Server Deploy
```bash
# Right-click folder → Scripts → "Deploy to Dev Server"
# Or manually:
curl -X POST http://192.168.86.41:3000/deploy \
  -H "Content-Type: application/json" \
  -d '{"repoUrl": "local", "repoName": "link-shortener"}'
```

### Production Deploy (Railway)
```bash
railway login
railway init
railway up
```

## Current Status

- [ ] Initial setup (Next.js, Neon connection)
- [ ] Create link endpoint
- [ ] Redirect handler with click tracking
- [ ] Dashboard with basic stats
- [ ] Deploy to Railway

## Notes

- Keep it simple - no auth for MVP
- Focus on speed - redirects should be <100ms
- Analytics are a nice-to-have, prioritize core functionality
