import '../styles/globals.css'
import React from 'react'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { WorkspaceSwitcher } from '@/components/workspaces/workspace-switcher'
import type { Workspace } from '@/types'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-app-gradient text-slate-200 antialiased">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="flex items-center justify-between py-4">
            <div className="font-semibold">Scrapius</div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <a className="opacity-90 hover:opacity-100" href="/">Dashboard</a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a className="opacity-90 hover:opacity-100" href="/scrapers">Scrapers</a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a className="opacity-90 hover:opacity-100" href="/settings/billing">Billing</a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2">
              {/* Mock data for now; replace with real user workspaces */}
              <WorkspaceSwitcher
                workspaces={[{ id: 'w1', name: 'Acme' }, { id: 'w2', name: 'Personal' }] as Workspace[]}
                current={{ id: 'w1', name: 'Acme' }}
              />
              <Button className="button-primary">Download extension</Button>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
