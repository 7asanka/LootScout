const express = require('express')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/deals', async (req, res) => {
  const { title, maxPrice, minDiscount, storeID, pageSize = 10 } = req.query

  const params = new URLSearchParams()
  if (title) params.append('title', title)
  if (maxPrice) params.append('upperPrice', maxPrice)
  if (minDiscount) params.append('lowerPrice', 0) // CheapShark doesn't filter by % directly
  if (storeID) params.append('storeID', storeID)
  params.append('pageSize', pageSize)
  params.append('sortBy', 'Deal Rating')

  try {
    const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?${params}`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('failed to fetch deals:', err)
    res.status(500).json({ error: 'something went wrong' })
  }
})

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})