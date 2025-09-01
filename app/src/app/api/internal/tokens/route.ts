import { NextRequest } from 'next/server'
import { db } from '@/db/client'
import { apiTokens } from '@/db/schema'
import { ok, badRequest, created, unauthorized } from '@/lib/api/response'
import { generateToken, sha256Hex } from '@/lib/crypto'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const CreateInput = z.object({ orgId: z.string(), name: z.string().min(1) })

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()
  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get('orgId')
  if (!orgId) return badRequest('Missing orgId')
  const rows = await db.select().from(apiTokens).where(eq(apiTokens.orgId, orgId))
  return ok(rows)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()
  const json = await req.json().catch(() => undefined)
  const parsed = CreateInput.safeParse(json)
  if (!parsed.success) return badRequest('Invalid body', parsed.error.flatten())
  const token = generateToken(24)
  const hash = sha256Hex(token)
  const id = `tok_${Math.random().toString(36).slice(2, 10)}`
  await db.insert(apiTokens).values({ id, orgId: parsed.data.orgId, name: parsed.data.name, hash })
  return created({ id, token }) // Show token once
}
