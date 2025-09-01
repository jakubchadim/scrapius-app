import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrapersTable } from '@/components/scrapers/scrapers-table'
import type { Scraper } from '@/types'
import Test from "@/app/dashboard/test";

const mockScrapers: Scraper[] = [
  { id: 's1', orgId: 'w1', name: 'News Scraper', enabled: true, visibility: 'org' },
  { id: 's2', orgId: 'w1', name: 'Prices Scraper', enabled: false, visibility: 'private' },
]

export default function DashboardPage() {
  return (
    <main>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-slate-300">Your API token and quick actions.</p>

      <Card className="bg-white/5 border border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle>Your API token</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 rounded bg-black/40">sk_live_••••••••••••••••</code>
            <Button variant="outline">Copy</Button>
            <Button variant="outline">Rotate</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-white/5 border border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle>Your scrapers</CardTitle>
            <Test />
        </CardHeader>
        <CardContent>
          {mockScrapers.length ? (
            <ScrapersTable scrapers={mockScrapers} />
          ) : (
            <div className="text-center py-8">
              <div className="text-slate-300">No scrapers yet.</div>
              <Button className="button-primary mt-4">Create your first scraper</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
