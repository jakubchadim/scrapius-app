export type Workspace = {
  id: string
  name: string
}

export type Scraper = {
  id: string
  orgId: string
  name: string
  enabled: boolean
  visibility: 'private' | 'org'
}
