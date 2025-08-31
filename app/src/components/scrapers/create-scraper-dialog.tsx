"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function CreateScraperDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [visibility, setVisibility] = useState<'org' | 'private'>('org')
  const [enabled, setEnabled] = useState(true)

  function onCreate() {
    // TODO: call API to create; for now just close
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="button-primary">Create scraper</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create scraper</DialogTitle>
          <DialogDescription>Define basic properties; you can add code later.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="My scraper" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="visibility">Visibility</Label>
            <select
              id="visibility"
              className="bg-transparent border border-white/10 rounded px-3 py-2"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'org' | 'private')}
            >
              <option value="org">Organization</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <Label htmlFor="enabled">Enabled</Label>
              <span className="text-xs text-slate-400">Disabled scrapers won’t be available to run.</span>
            </div>
            <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="button-primary" onClick={onCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
