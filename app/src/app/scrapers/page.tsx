import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateScraperDialog } from '@/components/scrapers/create-scraper-dialog'
import { ScrapersTable } from '@/components/scrapers/scrapers-table'
import type { Scraper } from '@/types'

const mockScrapers: Scraper[] = [
  { id: 's1', orgId: 'w1', name: 'News Scraper', enabled: true, visibility: 'org' },
  { id: 's2', orgId: 'w1', name: 'Prices Scraper', enabled: false, visibility: 'private' },
]

export default function ScrapersPage() {
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Scrapers</h1>
  <CreateScraperDialog />
      </div>

      <Card className="mt-6 bg-white/5 border border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle>All scrapers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrapersTable scrapers={mockScrapers} />
        </CardContent>
      </Card>
    </main>
  )
}
