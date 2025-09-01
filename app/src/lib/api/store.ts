import type { z } from 'zod'
import { ScraperSchema } from './schemas'

export type Scraper = z.infer<typeof ScraperSchema>

// Simple in-memory store for MVP; replace with DB later
const scrapers = new Map<string, Scraper>()

export const store = {
  listByOrg(orgId: string): Scraper[] {
    return Array.from(scrapers.values()).filter(s => s.orgId === orgId)
  },
  get(id: string): Scraper | undefined {
    return scrapers.get(id)
  },
  upsert(s: Scraper) {
    scrapers.set(s.id, s)
    return s
  },
  delete(id: string) {
    return scrapers.delete(id)
  }
}
