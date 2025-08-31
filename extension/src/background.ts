const API_BASE = '__API_BASE_URL__'
const TOKEN = '__API_TOKEN__'
const USER_ID = '__USER_ID__'
const ORG_ID = '__ORG_ID__'

chrome.runtime.onInstalled.addListener(() => {
  console.log('Scrapius extension installed for org', ORG_ID)
})

chrome.action.onClicked.addListener(async () => {
  // Example: call API to fetch scrapers list
  try {
    const res = await fetch(`${API_BASE}/api/v1/scrapers`, {
      headers: { 'X-API-Key': TOKEN }
    })
    const data = await res.json()
    console.log('Scrapers', data)
  } catch (e) {
    console.error('Failed to fetch scrapers', e)
  }
})
