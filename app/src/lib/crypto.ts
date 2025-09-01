import { randomBytes, createHash } from 'crypto'

export function generateToken(bytes = 32) {
  return randomBytes(bytes).toString('hex')
}

export function sha256Hex(input: string) {
  return createHash('sha256').update(input).digest('hex')
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  let diff = ab.length ^ bb.length
  const len = Math.max(ab.length, bb.length)
  for (let i = 0; i < len; i++) {
    const av = i < ab.length ? ab[i] : 0
    const bv = i < bb.length ? bb[i] : 0
    diff |= av ^ bv
  }
  return diff === 0
}
