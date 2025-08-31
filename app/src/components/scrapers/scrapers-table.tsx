"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Scraper } from '@/types'
import { Button } from '@/components/ui/button'

export function ScrapersTable({ scrapers }: { scrapers: Scraper[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scrapers.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell>
              {s.enabled ? (
                <Badge variant="default">Enabled</Badge>
              ) : (
                <Badge variant="secondary">Disabled</Badge>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{s.visibility}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="inline-flex gap-2">
                <Button size="sm" variant="outline">Run</Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/scrapers/${s.id}`}>Edit</a>
                </Button>
                <Button size="sm" variant="destructive">Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
