# LootScout

A lightweight web app for browsing discounted PC games across multiple storefronts. Deals are fetched from the CheapShark API and game details come from the Steam API.

## Prerequisites

- Node.js v14 or higher
- npm

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/7asanka/lootscout.git
   cd lootscout
```

2. Install dependencies:
```bash
   npm install
```

## Running the app

```bash
npm start
```

Then open your browser and go to `http://localhost:3000`

## Stack

- Node.js + Express (backend proxy)
- Vanilla HTML, CSS, JavaScript (frontend)
- CheapShark API — deal aggregation
- Steam API — game details, screenshots, ratings

## Features

- Browse best deals by store (Steam, GOG, Epic, Humble)
- Search games by name
- Filter by price, discount %, and store
- Sort by deal rating, discount, or price
- Individual game pages with screenshots and Metacritic score
- Pagination
- Mobile responsive