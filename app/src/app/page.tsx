import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <main>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
      <p className="mt-2 text-slate-300">Your workspace is ready. Use the button below to download your extension.</p>
      <Card className="mt-8 bg-white/5 border border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle>Get started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button className="button-primary">Download extension</Button>
            <Button variant="outline">Create scraper</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
