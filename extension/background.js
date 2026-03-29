// ── URL cache — avoids a storage read on every tab navigation ────────────────
let cachedUrls = null

function getUrls(cb) {
  if (cachedUrls !== null) { cb(cachedUrls); return }
  chrome.storage.sync.get({ urls: [] }, (data) => {
    cachedUrls = data.urls
    cb(cachedUrls)
  })
}

// Keep cache in sync whenever storage changes (e.g. popup adds/removes a URL)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.urls) {
    cachedUrls = changes.urls.newValue ?? []
  }
})

// ── Injection ─────────────────────────────────────────────────────────────────
function inject(tabId) {
  chrome.scripting.insertCSS({ target: { tabId }, files: ['overlay.css'] }).catch(() => {})
  chrome.scripting.executeScript({ target: { tabId }, files: ['content_script.js'] }).catch(() => {})
}

function maybeInject(tabId, url) {
  if (!tabId || !url || !url.startsWith('http')) return
  try {
    const origin = new URL(url).origin
    getUrls((urls) => {
      if (urls.includes(origin)) inject(tabId)
    })
  } catch {}
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    maybeInject(tabId, tab.url)
  }
})
