import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ScraperDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Scraper #{id}</h1>
        <div className="flex gap-2">
          <Button variant="outline">Run</Button>
          <Button className="button-primary">Save</Button>
        </div>
      </div>

      <Tabs defaultValue="settings" className="mt-6">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <Card className="mt-4 bg-white/5 border border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-300">Coming soon: form for visibility, availabilityUrls, exposedVia, enabled, etc.</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="code">
          <Card className="mt-4 bg-white/5 border border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle>Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-300">Coming soon: Monaco editor with JS source.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
