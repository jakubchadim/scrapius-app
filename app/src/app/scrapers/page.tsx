"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateScraperDialog } from '@/components/scrapers/create-scraper-dialog'
import { ScrapersTable } from '@/components/scrapers/scrapers-table'
import type { Scraper } from '@/types'

const initialScrapers: Scraper[] = [
  { id: 's1', orgId: 'w1', name: 'News Scraper', enabled: true, visibility: 'org' },
  { id: 's2', orgId: 'w1', name: 'Prices Scraper', enabled: false, visibility: 'private' },
]

export default function ScrapersPage() {
  const [scrapers, setScrapers] = useState<Scraper[]>(initialScrapers)
  const [openCreate, setOpenCreate] = useState(false)

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Scrapers</h1>
        <CreateScraperDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreateScraper={(input) => {
            const id = `s${scrapers.length + 1}`
            setScrapers((prev) => [
              ...prev,
              { id, orgId: 'w1', name: input.name || `Scraper ${id}`, enabled: input.enabled, visibility: input.visibility },
            ])
          }}
        />
      </div>

      <Card className="mt-6 bg-white/5 border border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle>All scrapers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrapersTable scrapers={scrapers} onCreate={() => setOpenCreate(true)} />
        </CardContent>
      </Card>
    </main>
  )
}
