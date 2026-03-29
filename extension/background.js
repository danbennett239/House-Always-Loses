// Inject content script + CSS into tabs whose origin matches the stored URL list

function getStoredUrls(cb) {
  chrome.storage.sync.get({ urls: [] }, (data) => cb(data.urls))
}

function inject(tabId) {
  chrome.scripting.insertCSS({ target: { tabId }, files: ['overlay.css'] })
    .catch(() => {})
  chrome.scripting.executeScript({ target: { tabId }, files: ['content_script.js'] })
    .catch(() => {})
}

function maybeInject(tabId, url) {
  if (!url || !url.startsWith('http')) return
  try {
    const origin = new URL(url).origin
    getStoredUrls((urls) => {
      if (urls.includes(origin)) inject(tabId)
    })
  } catch {}
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    maybeInject(tabId, tab.url)
  }
})
