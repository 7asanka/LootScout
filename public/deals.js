const searchBtn = document.getElementById('searchBtn')
const searchInput = document.getElementById('search')
const resultsEl = document.getElementById('results')
const sidebar = document.getElementById('sidebar')
const clearBtn = document.getElementById('clearFilters')
const pagination = document.getElementById('pagination')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const pageInfo = document.getElementById('pageInfo')

let stores = {}
let currentPage = 1
let totalPages = 1

async function loadStores() {
  try {
    const res = await fetch('/api/stores')
    const data = await res.json()
    data.forEach(s => {
      stores[s.storeID] = s
    })
  } catch (err) {
    console.error('failed to load stores:', err)
  }
}

function getFilters() {
  return {
    title: searchInput.value.trim(),
    pageSize: document.getElementById('pageSize').value,
    sortBy: document.getElementById('sortBy').value,
    maxPrice: document.getElementById('maxPrice').value,
    minDiscount: document.getElementById('minDiscount').value,
    storeID: document.getElementById('store').value
  }
}

async function fetchDeals(page = 1) {
  const { title, pageSize, sortBy, maxPrice, minDiscount, storeID } = getFilters()

  currentPage = page

  const params = new URLSearchParams()
  if (title) params.append('title', title)
  if (maxPrice) params.append('maxPrice', maxPrice)
  if (minDiscount) params.append('minDiscount', minDiscount)
  if (storeID) params.append('storeID', storeID)
  params.append('pageSize', pageSize)
  params.append('sortBy', sortBy)
  params.append('page', page - 1) // cheapshark is 0-indexed

  resultsEl.innerHTML = '<p class="loading">loading...</p>'
  pagination.classList.add('hidden')

  try {
    const res = await fetch(`/api/deals?${params}`)

    // cheapshark returns total page count in headers
    const total = res.headers.get('X-Total-Page-Count')
    totalPages = total ? parseInt(total) : 1

    const deals = await res.json()

    if (!deals.length) {
      resultsEl.innerHTML = '<p class="no-results">no deals found</p>'
      return
    }

    renderDeals(deals)
    updatePagination()

  } catch (err) {
    console.error('fetch failed:', err)
    resultsEl.innerHTML = '<p class="no-results">something went wrong</p>'
  }
}

function renderDeals(deals) {
  resultsEl.innerHTML = deals.map(deal => buildCard(deal)).join('')
}

function updatePagination() {
  if (totalPages <= 1) {
    pagination.classList.add('hidden')
    return
  }

  pagination.classList.remove('hidden')
  pageInfo.textContent = `page ${currentPage} of ${totalPages}`
  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = currentPage === totalPages
}

function clearFilters() {
  document.getElementById('maxPrice').value = ''
  document.getElementById('minDiscount').value = ''
  document.getElementById('store').value = ''
  fetchDeals(1)
}

function buildCard(deal) {
  const store = stores[deal.storeID]
  const storeBadge = store
    ? `<img src="https://www.cheapshark.com${store.images.icon}" alt="${store.storeName}" class="store-badge" />`
    : ''

  return `
    <a class="card" href="game.html?gameID=${deal.gameID}&steamAppID=${deal.steamAppID}">
      <div class="card-thumb">
        <img src="${deal.thumb}" alt="${deal.title}" />
        ${storeBadge}
      </div>
      <div class="card-body">
        <h3>${deal.title}</h3>
        <p class="price">
          <span>$${parseFloat(deal.salePrice).toFixed(2)}</span>
          was $${parseFloat(deal.normalPrice).toFixed(2)}
        </p>
        <p class="discount">${Math.round(deal.savings)}% off</p>
      </div>
      <div class="card-footer">
        <button class="deal-btn" onclick="event.preventDefault(); event.stopPropagation(); window.open('https://www.cheapshark.com/redirect?dealID=${deal.dealID}', '_blank')">get deal</button>
      </div>
    </a>
  `
}

// filters apply instantly
document.getElementById('maxPrice').addEventListener('input', () => fetchDeals(1))
document.getElementById('minDiscount').addEventListener('input', () => fetchDeals(1))
document.getElementById('store').addEventListener('change', () => fetchDeals(1))
document.getElementById('pageSize').addEventListener('change', () => fetchDeals(1))
document.getElementById('sortBy').addEventListener('change', () => fetchDeals(1))

// enter key support
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') fetchDeals(1)
})

prevBtn.addEventListener('click', () => fetchDeals(currentPage - 1))
nextBtn.addEventListener('click', () => fetchDeals(currentPage + 1))
searchBtn.addEventListener('click', () => fetchDeals(1))
clearBtn.addEventListener('click', clearFilters)

async function init() {
  await loadStores()
  await fetchDeals(1)
}

init()