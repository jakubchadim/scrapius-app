import { NextRequest } from 'next/server'
import { z } from 'zod'
import { UpdateScraperInput } from '@/lib/api/schemas'
import { badRequest, notFound, ok, unauthorized } from '@/lib/api/response'
import { store } from '@/lib/api/store'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const Params = z.object({ id: z.string() })

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()
  const parsed = Params.safeParse(params)
  if (!parsed.success) return badRequest('Invalid id', parsed.error.flatten())
  const item = store.get(parsed.data.id)
  if (!item) return notFound('Scraper not found')
  return ok(item)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()
  const parsed = Params.safeParse(params)
  if (!parsed.success) return badRequest('Invalid id', parsed.error.flatten())
  const body = await req.json().catch(() => undefined)
  const update = UpdateScraperInput.safeParse(body)
  if (!update.success) return badRequest('Invalid body', update.error.flatten())
  const current = store.get(parsed.data.id)
  if (!current) return notFound('Scraper not found')
  const next = { ...current, ...update.data }
  store.upsert(next)
  return ok(next)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()
  const parsed = Params.safeParse(params)
  if (!parsed.success) return badRequest('Invalid id', parsed.error.flatten())
  const existed = store.get(parsed.data.id)
  if (!existed) return notFound('Scraper not found')
  store.delete(parsed.data.id)
  return ok({ id: parsed.data.id })
}
