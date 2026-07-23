const express = require('express')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const CHEAPSHARK_HEADERS = {
  'User-Agent': 'LootScout/1.0 (portfolio project)'
}

app.use(express.static(path.join(__dirname, 'public')))

// deals — used for both search and featured (all time lows)
app.get('/api/deals', async (req, res) => {
  const { title, maxPrice, minDiscount, storeID, pageSize = 20, sortBy = 'Deal Rating', page = 0 } = req.query

  const params = new URLSearchParams()
  if (title) params.append('title', title)
  if (maxPrice) params.append('upperPrice', maxPrice)
  if (storeID) params.append('storeID', storeID)
  params.append('pageSize', pageSize)
  params.append('sortBy', sortBy)
  params.append('pageNumber', page)
  params.append('onSale', 1)

  try {
    const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?${params}`, { headers: CHEAPSHARK_HEADERS })
    const totalPages = response.headers.get('X-Total-Page-Count')
    const data = await response.json()

    // filter by discount % client-side since cheapshark doesn't support it
    const filtered = minDiscount
      ? data.filter(d => parseFloat(d.savings) >= parseFloat(minDiscount))
      : data

    res.set('X-Total-Page-Count', totalPages || 1)
    res.json(filtered)
  } catch (err) {
    console.error('failed to fetch deals:', err)
    res.status(500).json({ error: 'something went wrong' })
  }
})

// all time lows — sorted by lowest sale price
app.get('/api/featured', async (req, res) => {
  const { storeID = '1' } = req.query

  const params = new URLSearchParams()
  params.append('sortBy', 'Deal Rating')
  params.append('pageSize', 12)
  params.append('storeID', storeID)
  params.append('onSale', 1)

  try {
    const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?${params}`, { headers: CHEAPSHARK_HEADERS })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('failed to fetch featured deals:', err)
    res.status(500).json({ error: 'something went wrong' })
  }
})

// store list — used to get logos
app.get('/api/stores', async (req, res) => {
  try {
    const response = await fetch('https://www.cheapshark.com/api/1.0/stores', { headers: CHEAPSHARK_HEADERS })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('failed to fetch stores:', err)
    res.status(500).json({ error: 'something went wrong' })
  }
})

// single game info from cheapshark
app.get('/api/game/:gameID', async (req, res) => {
  try {
    const response = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${req.params.gameID}`, { headers: CHEAPSHARK_HEADERS })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('failed to fetch game:', err)
    res.status(500).json({ error: 'something went wrong' })
  }
})

// steam game details — description, screenshots, metacritic
app.get('/api/steam/:steamAppID', async (req, res) => {
  try {
    const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${req.params.steamAppID}`, { headers: CHEAPSHARK_HEADERS })
    const data = await response.json()
    const gameData = data[req.params.steamAppID]

    if (!gameData.success) {
      return res.status(404).json({ error: 'game not found on steam' })
    }

    res.json(gameData.data)
  } catch (err) {
    console.error('failed to fetch steam data:', err)
    res.status(500).json({ error: 'something went wrong' })
  }
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  })
}

module.exports = app