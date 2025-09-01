import { NextRequest } from 'next/server'
import { z } from 'zod'
import { CreateScraperInput, ScraperSchema } from '@/lib/api/schemas'
import { badRequest, created, methodNotAllowed, ok } from '@/lib/api/response'
import { store } from '@/lib/api/store'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unauthorized } from '@/lib/api/response'

const ListQuery = z.object({ orgId: z.string() })

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()
  const { searchParams } = new URL(req.url)
  const parsed = ListQuery.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return badRequest('Invalid query', parsed.error.flatten())
  const items = store.listByOrg(parsed.data.orgId)
  return ok(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()
  const body = await req.json().catch(() => undefined)
  const parsed = CreateScraperInput.safeParse(body)
  if (!parsed.success) return badRequest('Invalid body', parsed.error.flatten())
  const id = `s_${Math.random().toString(36).slice(2, 9)}`
  const scraper = ScraperSchema.parse({ id, ...parsed.data })
  store.upsert(scraper)
  return created(scraper)
}

export function OPTIONS() {
  return methodNotAllowed('OPTIONS', ['GET', 'POST'])
}
