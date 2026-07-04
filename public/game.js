const gamePage = document.getElementById('game-page')
const params = new URLSearchParams(window.location.search)
const gameID = params.get('gameID')
const steamAppID = params.get('steamAppID')

async function loadGame() {
  if (!gameID) {
    gamePage.innerHTML = '<p class="no-results">no game specified</p>'
    return
  }

  try {
    const [cheapsharkRes, steamRes] = await Promise.all([
      fetch(`/api/game/${gameID}`),
      steamAppID ? fetch(`/api/steam/${steamAppID}`) : Promise.resolve(null)
    ])

    const cheapshark = await cheapsharkRes.json()
    const steam = steamRes ? await steamRes.json() : null

    const deal = cheapshark.deals?.[0]
    const info = cheapshark.info

    const title = steam?.name || info?.title || 'Unknown Game'
    const thumb = steam?.header_image || info?.thumb || ''
    const description = steam?.short_description || ''
    const metacritic = steam?.metacritic?.score || null
    const screenshots = steam?.screenshots?.slice(0, 6) || []

    const salePrice = deal ? `$${parseFloat(deal.price).toFixed(2)}` : 'N/A'
    const normalPrice = deal ? `$${parseFloat(deal.retailPrice).toFixed(2)}` : 'N/A'
    const savings = deal ? `${Math.round(deal.savings)}% off` : ''
    const dealID = deal?.dealID || null

    gamePage.innerHTML = `
      <div class="game-hero">
        <img src="${thumb}" alt="${title}" />
        <div class="game-info">
          <h1>${title}</h1>
          ${metacritic ? `<span class="metacritic">Metacritic: ${metacritic}</span>` : ''}
          <p class="sale-price">${salePrice}</p>
          <p class="normal-price">${normalPrice}</p>
          ${savings ? `<span class="discount-badge">${savings}</span>` : ''}
          ${dealID
            ? `<a class="btn-primary" href="https://www.cheapshark.com/redirect?dealID=${dealID}" target="_blank">get deal</a>`
            : ''}
        </div>
      </div>

      ${description ? `<p class="game-description">${description}</p>` : ''}

      ${screenshots.length ? `
        <div class="game-screenshots">
          ${screenshots.map(s => `<img src="${s.path_thumbnail}" alt="screenshot" />`).join('')}
        </div>
      ` : ''}

      <a href="javascript:history.back()" style="color: var(--muted); font-size: 0.85rem;">← back</a>
    `

  } catch (err) {
    console.error('failed to load game:', err)
    gamePage.innerHTML = '<p class="no-results">something went wrong</p>'
  }
}

loadGame()