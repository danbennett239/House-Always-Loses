const listEl  = document.getElementById('url-list')
const input   = document.getElementById('url-input')
const addBtn  = document.getElementById('add-btn')
const errorEl = document.getElementById('error')

function normalise(raw) {
  try {
    const url = new URL(raw.trim())
    // Store just origin (scheme + host + port) as the match pattern
    return url.origin
  } catch {
    return null
  }
}

function renderList(urls) {
  listEl.innerHTML = ''
  if (urls.length === 0) {
    listEl.innerHTML = '<p class="empty">No sites added yet.</p>'
    return
  }
  urls.forEach((url) => {
    const item = document.createElement('div')
    item.className = 'url-item'
    item.innerHTML = `
      <span class="url-text" title="${url}">${url}</span>
      <button class="remove-btn" data-url="${url}" title="Remove">×</button>
    `
    listEl.appendChild(item)
  })
}

function loadUrls(cb) {
  chrome.storage.sync.get({ urls: [] }, (data) => cb(data.urls))
}

function saveUrls(urls, cb) {
  chrome.storage.sync.set({ urls }, cb)
}

// Initial render
loadUrls(renderList)

// Add
function handleAdd() {
  const origin = normalise(input.value)
  if (!origin) {
    errorEl.textContent = 'Enter a valid URL (e.g. https://example.com)'
    return
  }
  errorEl.textContent = ''
  loadUrls((urls) => {
    if (urls.includes(origin)) {
      errorEl.textContent = 'Already in the list.'
      return
    }
    const next = [...urls, origin]
    saveUrls(next, () => {
      renderList(next)
      input.value = ''
      // Inject immediately into any already-open tabs matching this origin
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (!tab.url) return
          try {
            if (new URL(tab.url).origin === origin) {
              chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['overlay.css'] }).catch(() => {})
              chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content_script.js'] }).catch(() => {})
            }
          } catch {}
        })
      })
    })
  })
}

addBtn.addEventListener('click', handleAdd)
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAdd() })

// Remove
listEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove-btn')
  if (!btn) return
  const url = btn.dataset.url
  loadUrls((urls) => {
    const next = urls.filter(u => u !== url)
    saveUrls(next, () => renderList(next))
  })
})
