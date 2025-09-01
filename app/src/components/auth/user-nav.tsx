"use client"

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function UserNav() {
  const { status, data } = useSession()
  if (status === 'loading') return <Button variant="outline" disabled>Loading…</Button>
  if (status === 'unauthenticated') return <Button className="button-primary" onClick={() => signIn('google')}>Sign in</Button>
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm opacity-90">{data?.user?.email}</span>
      <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
    </div>
  )
}
