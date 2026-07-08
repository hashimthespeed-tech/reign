// marketData.js — THE single source of truth for all stock prices in Reign.
//
// No page, component, or function may hardcode a price or hit a market API
// directly. Everything goes through here. This module talks to the server-side
// caching proxy at /.netlify/functions/quote (Finnhub under the hood), and adds
// a short client-side cache so repeated reads within a page render coalesce.
//
// Quote shape returned to callers:
//   { ticker, price, change, changePercent, high, low, open,
//     previousClose, timestamp, valid }

const CLIENT_TTL_MS = 30 * 1000
const clientCache = new Map() // TICKER -> { data, ts }
const inflight = new Map()    // TICKER -> Promise (dedupe concurrent fetches)

const norm = (t) => String(t || '').trim().toUpperCase()

async function fetchFromServer(symbols) {
  const query = symbols.join(',')
  const res = await fetch(`/.netlify/functions/quote?symbols=${encodeURIComponent(query)}`)
  if (!res.ok) {
    let msg = `Quote service error (${res.status})`
    try {
      const body = await res.json()
      if (body.error) msg = body.error
    } catch { /* ignore parse error */ }
    throw new Error(msg)
  }
  const body = await res.json()
  return body.quotes || {}
}

/**
 * Get quotes for many tickers at once. Returns an object keyed by uppercase
 * ticker. Served from client cache where fresh; only the misses hit the server.
 */
export async function getQuotes(tickers) {
  const wanted = [...new Set((tickers || []).map(norm).filter(Boolean))]
  if (wanted.length === 0) return {}

  const now = Date.now()
  const out = {}
  const need = []

  for (const t of wanted) {
    const c = clientCache.get(t)
    if (c && now - c.ts < CLIENT_TTL_MS) {
      out[t] = c.data
    } else if (inflight.has(t)) {
      // A fetch for this ticker is already in progress; await it below.
      need.push(t)
    } else {
      need.push(t)
    }
  }

  if (need.length > 0) {
    // Dedupe: only fetch tickers that don't already have an inflight request.
    const toFetch = need.filter((t) => !inflight.has(t))
    if (toFetch.length > 0) {
      const p = fetchFromServer(toFetch)
      // Attach the same promise to each ticker so concurrent callers share it.
      toFetch.forEach((t) => inflight.set(t, p))
      try {
        const fetched = await p
        const ts = Date.now()
        for (const t of toFetch) {
          if (fetched[t]) clientCache.set(t, { data: fetched[t], ts })
        }
      } finally {
        toFetch.forEach((t) => inflight.delete(t))
      }
    }
    // Await any inflight requests we piggybacked on, then read from cache.
    await Promise.all(need.map((t) => inflight.get(t)).filter(Boolean))
    for (const t of need) {
      const c = clientCache.get(t)
      if (c) out[t] = c.data
    }
  }

  return out
}

/** Get a single quote, or null if unavailable. */
export async function getQuote(ticker) {
  const t = norm(ticker)
  if (!t) return null
  const all = await getQuotes([t])
  return all[t] || null
}

/**
 * Compute the live market value of a set of holdings.
 * holdings: [{ ticker, shares, is_short }]
 * Returns { marketValue, byTicker } where byTicker[ticker] = { price, value, shares }.
 * Short positions contribute negative directional exposure handled by the caller;
 * here `value` is simply price * shares (magnitude), sign left to trading logic.
 */
export async function valueHoldings(holdings) {
  const list = (holdings || []).filter((h) => Number(h.shares) > 0)
  const tickers = list.map((h) => h.ticker)
  const quotes = await getQuotes(tickers)
  let marketValue = 0
  const byTicker = {}
  for (const h of list) {
    const q = quotes[norm(h.ticker)]
    const price = q && q.valid ? q.price : Number(h.avg_buy_price) || 0
    const value = price * Number(h.shares)
    byTicker[norm(h.ticker)] = { price, value, shares: Number(h.shares) }
    marketValue += value
  }
  return { marketValue, byTicker }
}

/** Clear the client cache (useful after a trade to force a refresh). */
export function clearQuoteCache() {
  clientCache.clear()
}
