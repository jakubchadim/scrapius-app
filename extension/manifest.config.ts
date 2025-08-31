import type { ManifestV3Export } from '@crxjs/vite-plugin'

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Scrapius – __ORG_ID__',
  version: '0.1.0',
  description: 'Scrapius helper extension',
  host_permissions: [
    // Will be replaced by Next.js ZIP route based on scrapers
    "<all_urls>"
  ],
  background: {
    service_worker: 'src/background.ts',
    type: 'module'
  },
  action: {
    default_popup: 'src/ui/popup.html'
  },
  permissions: [
    'storage'
  ],
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ['src/content.ts']
    }
  ]
}

export default manifest
