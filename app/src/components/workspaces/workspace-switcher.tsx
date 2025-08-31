"use client"

import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Workspace } from '@/types'

export function WorkspaceSwitcher({
  workspaces,
  current,
  onSelect,
}: {
  workspaces: Workspace[]
  current: Workspace
  onSelect?: (w: Workspace) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span className="truncate max-w-[160px]" title={current.name}>{current.name}</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.id} onClick={() => onSelect?.(w)}>
            {w.name}
          </DropdownMenuItem>
        ))}
        <div className="h-px bg-white/10 my-1" />
        <DropdownMenuItem onClick={() => onSelect?.({ id: 'new', name: 'Create new…' })}>
          + Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
