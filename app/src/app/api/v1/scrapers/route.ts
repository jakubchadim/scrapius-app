import { NextRequest } from 'next/server'
import { db } from '@/db/client'
import { apiTokens, scrapers } from '@/db/schema'
import { badRequest, ok, unauthorized } from '@/lib/api/response'
import { sha256Hex, safeEqual } from '@/lib/crypto'
import { and, eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-api-key')
  const orgId = req.headers.get('x-org-id') || undefined
  if (!token) return unauthorized('Missing X-API-Key')
  const hash = sha256Hex(token)
  const rows = await db.select().from(apiTokens)
  const match = rows.find((r) => !r.revokedAt && safeEqual(r.hash, hash) && (!orgId || r.orgId === orgId))
  if (!match) return unauthorized('Invalid API key')
  if (!match.orgId) return badRequest('API key not scoped to an organization')
  const items = await db.select({ id: scrapers.id, name: scrapers.name, enabled: scrapers.enabled, visibility: scrapers.visibility }).from(scrapers).where(eq(scrapers.orgId, match.orgId))
  return ok(items)
}
