# Link Shortener

> A modern URL shortener with analytics, custom slugs, and QR codes

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 14 (App Router) | Modern React with server components |
| Backend | Next.js API Routes | Unified full-stack framework |
| Database | Neon Postgres | Serverless Postgres with edge caching |
| Styling | Tailwind CSS | Utility-first CSS |
| Deployment | Railway / Dev Server | Easy containerized deploys |

## Project Structure

```
~/projects/link-shortener/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page with URL input
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── [shortCode]/
│   │       └── page.tsx          # Redirect handler
│   ├── components/
│   │   ├── UrlForm.tsx           # URL input form
│   │   ├── LinkCard.tsx          # Display created short link
│   │   └── QrCode.tsx            # QR code generator
│   ├── lib/
│   │   ├── db.ts                 # Database connection
│   │   ├── utils.ts              # Utility functions
│   │   └── generateShortCode.ts  # Short code generator
│   └── types/
│       └── index.ts              # TypeScript types
├── prisma/
│   └── schema.prisma             # Database schema
├── public/
├── Dockerfile
├── package.json
└── .env                          # Database URL (from Vault)
```

## API Design

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/shorten` | POST | Create short URL |
| `/api/links` | GET | List user's links |
| `/api/links/[id]` | DELETE | Delete a link |
| `/api/stats/[shortCode]` | GET | Get click analytics |
| `/[shortCode]` | GET | Redirect to original URL |

### POST /api/shorten

```json
{
  "url": "https://example.com/very/long/url",
  "customSlug": "my-link" // optional
}
```

Response:
```json
{
  "shortCode": "abc123",
  "shortUrl": "https://link-shortener.sha.red/abc123",
  "qrCode": "data:image/png;base64,..."
}
```

## Database Schema

```prisma
model Link {
  id          String   @id @default(cuid())
  shortCode   String   @unique
  originalUrl String
  clicks      Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([shortCode])
}

model Click {
  id        String   @id @default(cuid())
  linkId    String
  link      Link     @relation(fields: [linkId], references: [id])
  ip        String?
  userAgent String?
  referrer  String?
  country   String?
  createdAt DateTime @default(now())
  
  @@index([linkId])
  @@index([createdAt])
}
```

## External Services

| Service | Purpose | Env Var |
|---------|---------|---------|
| Neon | PostgreSQL database | `DATABASE_URL` |

## Conventions

- **File naming**: PascalCase for components, camelCase for utilities
- **Component structure**: Server components by default, 'use client' only when needed
- **Error handling**: Try/catch in API routes, return proper HTTP status codes
- **Short codes**: 6-character alphanumeric (a-z, A-Z, 0-9) = 62^6 combinations

## Development

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma generate

# Run dev server
npm run dev
```

## Deployment

- **Preview**: https://link-shortener.sha.red
- **Production**: TBD

## Current Status

- [x] Initial setup
- [ ] Database schema
- [ ] Core API endpoints
- [ ] Frontend UI
- [ ] QR code generation
- [ ] Analytics tracking
- [ ] Testing
- [ ] Production deploy
