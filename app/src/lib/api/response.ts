import { NextResponse } from 'next/server'

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, { status: 200, ...init })
}

export function created<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, { status: 201, ...init })
}

export function badRequest(message: string, issues?: unknown, init?: ResponseInit) {
  return NextResponse.json({ success: false, error: { message, issues } }, { status: 400, ...init })
}

export function notFound(message = 'Not found', init?: ResponseInit) {
  return NextResponse.json({ success: false, error: { message } }, { status: 404, ...init })
}

export function methodNotAllowed(method: string, allowed: string[]) {
  return NextResponse.json({ success: false, error: { message: `Method ${method} not allowed`, allowed } }, { status: 405, headers: { 'Allow': allowed.join(', ') } })
}

export function unauthorized(message = 'Unauthorized', init?: ResponseInit) {
  return NextResponse.json({ success: false, error: { message } }, { status: 401, ...init })
}
