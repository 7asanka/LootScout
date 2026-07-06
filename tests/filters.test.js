describe('discount filter', () => {
  const deals = [
    { title: 'Game A', salePrice: '1.99', normalPrice: '19.99', savings: '90.05' },
    { title: 'Game B', salePrice: '5.00', normalPrice: '10.00', savings: '50.00' },
    { title: 'Game C', salePrice: '8.00', normalPrice: '10.00', savings: '20.00' },
  ]

  it('filters out deals below min discount', () => {
    const filtered = deals.filter(d => parseFloat(d.savings) >= 50)
    expect(filtered.length).toBe(2)
    expect(filtered.map(d => d.title)).toEqual(['Game A', 'Game B'])
  })

  it('returns all deals when no min discount set', () => {
    const filtered = deals.filter(d => parseFloat(d.savings) >= 0)
    expect(filtered.length).toBe(3)
  })
})

describe('price filter', () => {
  const deals = [
    { title: 'Game A', salePrice: '1.99' },
    { title: 'Game B', salePrice: '5.00' },
    { title: 'Game C', salePrice: '12.00' },
  ]

  it('filters out deals above max price', () => {
    const filtered = deals.filter(d => parseFloat(d.salePrice) <= 5)
    expect(filtered.length).toBe(2)
    expect(filtered.map(d => d.title)).toEqual(['Game A', 'Game B'])
  })

  it('returns nothing when max price is 0', () => {
    const filtered = deals.filter(d => parseFloat(d.salePrice) <= 0)
    expect(filtered.length).toBe(0)
  })
})