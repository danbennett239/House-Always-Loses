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
    const empty = document.createElement('p')
    empty.className = 'empty'
    empty.textContent = 'No sites added yet.'
    listEl.appendChild(empty)
    return
  }
  urls.forEach((url) => {
    const item = document.createElement('div')
    item.className = 'url-item'

    const text = document.createElement('span')
    text.className = 'url-text'
    text.textContent = url
    text.title = url

    const btn = document.createElement('button')
    btn.className = 'remove-btn'
    btn.textContent = '×'
    btn.title = 'Remove'
    btn.dataset.url = url

    item.append(text, btn)
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
    // Request host permission for this origin before saving and injecting
    chrome.permissions.request({ origins: [origin + '/*'] }, (granted) => {
      if (!granted) {
        errorEl.textContent = 'Permission denied — cannot inject into that site.'
        return
      }
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
