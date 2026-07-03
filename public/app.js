const searchBtn = document.getElementById('searchBtn')
const resultsEl = document.getElementById('results')

searchBtn.addEventListener('click', fetchDeals)

async function fetchDeals() {
  const title = document.getElementById('search').value.trim()
  const maxPrice = document.getElementById('maxPrice').value
  const minDiscount = document.getElementById('minDiscount').value
  const store = document.getElementById('store').value
  const pageSize = document.getElementById('pageSize').value || 20

  const params = new URLSearchParams()
  if (title) params.append('title', title)
  if (maxPrice) params.append('maxPrice', maxPrice)
  if (store) params.append('storeID', store)
  params.append('pageSize', pageSize)

  resultsEl.innerHTML = '<p class="no-results">loading...</p>'

  try {
    const res = await fetch(`/api/deals?${params}`)
    const deals = await res.json()

    // filter by discount % client-side since cheapshark doesn't support it
    const filtered = minDiscount
      ? deals.filter(d => parseFloat(d.savings) >= parseFloat(minDiscount))
      : deals

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p class="no-results">no deals found</p>'
      return
    }

    resultsEl.innerHTML = filtered.map(deal => `
      <div class="card">
        <img src="${deal.thumb}" alt="${deal.title}" />
        <div class="card-body">
          <h3>${deal.title}</h3>
          <p class="price">
            <span>$${parseFloat(deal.salePrice).toFixed(2)}</span>
            was $${parseFloat(deal.normalPrice).toFixed(2)}
          </p>
          <p class="discount">${Math.round(deal.savings)}% off</p>
        </div>
        <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank">get deal</a>
      </div>
    `).join('')

  } catch (err) {
    console.error('fetch failed:', err)
    resultsEl.innerHTML = '<p class="no-results">something went wrong</p>'
  }
}