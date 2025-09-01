import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="h-8 w-40"><Skeleton className="h-8 w-40" /></div>
        <Skeleton className="h-9 w-36" />
      </div>

      <Card className="mt-6 bg-white/5 border border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 items-center gap-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-14" />
                  <Skeleton className="h-8 w-14" />
                  <Skeleton className="h-8 w-14" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
