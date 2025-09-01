# API (MVP)

- Contracts: `src/lib/api/schemas.ts` (Zod)
- Responses: `src/lib/api/response.ts`
- In-memory store: `src/lib/api/store.ts` (replace with DB later)

Routes:
- GET /api/scrapers?orgId=ORG_ID → list scrapers by workspace
- POST /api/scrapers { orgId, name, enabled?, visibility? }
- GET /api/scrapers/:id
- PATCH /api/scrapers/:id { name?, enabled?, visibility? }
- DELETE /api/scrapers/:id

Note: Auth is not wired yet; integrate NextAuth and org scoping next.
