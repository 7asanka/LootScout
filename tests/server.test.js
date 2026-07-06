const request = require('supertest')
const app = require('../server')

describe('GET /api/deals', () => {
  it('returns an array of deals', async () => {
    const res = await request(app).get('/api/deals')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('filters by maxPrice', async () => {
    const res = await request(app).get('/api/deals?maxPrice=5')
    expect(res.status).toBe(200)
    res.body.forEach(deal => {
      expect(parseFloat(deal.salePrice)).toBeLessThanOrEqual(5)
    })
  })

  it('filters by minDiscount', async () => {
    const res = await request(app).get('/api/deals?minDiscount=50')
    expect(res.status).toBe(200)
    res.body.forEach(deal => {
      expect(parseFloat(deal.savings)).toBeGreaterThanOrEqual(50)
    })
  })
})

describe('GET /api/featured', () => {
  it('returns an array of deals', async () => {
    const res = await request(app).get('/api/featured')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('accepts a storeID param', async () => {
    const res = await request(app).get('/api/featured?storeID=1')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('GET /api/stores', () => {
  it('returns a list of stores', async () => {
    const res = await request(app).get('/api/stores')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('each store has a storeID and storeName', async () => {
    const res = await request(app).get('/api/stores')
    res.body.forEach(store => {
      expect(store).toHaveProperty('storeID')
      expect(store).toHaveProperty('storeName')
    })
  })
})

describe('GET /api/game/:gameID', () => {
  it('returns game data for a valid gameID', async () => {
    const res = await request(app).get('/api/game/146')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('info')
    expect(res.body).toHaveProperty('deals')
  })
})