// Server-side stock quote proxy with per-ticker caching.
//
// Every price in Reign flows through this function so that, no matter how many
// students are online, we make at most ONE upstream Finnhub call per ticker per
// CACHE_TTL window. The client (src/lib/marketData.js) is the only caller.
//
// Provider: Finnhub (https://finnhub.io) — free tier, real-time US quotes.
// Endpoint: GET /quote?symbol=AAPL&token=KEY
//   -> { c: current, d: change, dp: pct change, h, l, o, pc: prev close, t }

const CACHE = new Map() // symbol -> { data, ts }
const CACHE_TTL_MS = 60 * 1000 // one upstream call per ticker per 60s

async function fetchQuote(symbol, apiKey) {
  const now = Date.now()
  const cached = CACHE.get(symbol)
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    return { ...cached.data, cached: true }
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) {
    // On upstream failure, serve stale cache if we have any rather than nothing.
    if (cached) return { ...cached.data, cached: true, stale: true }
    throw new Error(`Finnhub responded ${res.status} for ${symbol}`)
  }

  const j = await res.json()
  // Finnhub returns c:0 for unknown/invalid symbols.
  const data = {
    ticker: symbol,
    price: typeof j.c === 'number' ? j.c : null,
    change: typeof j.d === 'number' ? j.d : null,
    changePercent: typeof j.dp === 'number' ? j.dp : null,
    high: j.h ?? null,
    low: j.l ?? null,
    open: j.o ?? null,
    previousClose: j.pc ?? null,
    timestamp: j.t ?? null,
    valid: typeof j.c === 'number' && j.c > 0,
  }
  CACHE.set(symbol, { data, ts: now })
  return data
}

exports.handler = async function (event) {
  const apiKey = process.env.FINNHUB_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'FINNHUB_API_KEY is not configured on the server.' }),
    }
  }

  const raw = (event.queryStringParameters && event.queryStringParameters.symbols) || ''
  const symbols = [...new Set(
    raw.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
  )].slice(0, 50) // hard cap per request

  if (symbols.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Provide at least one ticker via ?symbols=AAPL,MSFT' }),
    }
  }

  try {
    const quotes = {}
    // Finnhub free tier is one symbol per /quote call; caching keeps this cheap.
    for (const sym of symbols) {
      quotes[sym] = await fetchQuote(sym, apiKey)
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
      },
      body: JSON.stringify({ quotes }),
    }
  } catch (error) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
