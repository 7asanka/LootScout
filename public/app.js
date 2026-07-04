const featuredGrid = document.getElementById('featured-grid')
const storeTabs = document.querySelectorAll('.store-tab')

let stores = {}
let activeStore = '1'

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

async function loadFeatured(storeID = '1') {
  featuredGrid.innerHTML = '<p class="loading">loading deals...</p>'

  try {
    const res = await fetch(`/api/featured?storeID=${storeID}`)
    const deals = await res.json()

    if (!deals.length) {
      featuredGrid.innerHTML = '<p class="no-results">no deals found</p>'
      return
    }

    featuredGrid.innerHTML = deals.map(deal => buildCard(deal)).join('')
  } catch (err) {
    console.error('failed to load featured:', err)
    featuredGrid.innerHTML = '<p class="no-results">something went wrong</p>'
  }
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

storeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    storeTabs.forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    activeStore = tab.dataset.store
    loadFeatured(activeStore)
  })
})

async function init() {
  await loadStores()
  await loadFeatured(activeStore)
}

init()