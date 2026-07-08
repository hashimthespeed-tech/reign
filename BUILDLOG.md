# Reign — Build Log

Running record of every phase: what was built, what the 3 verification passes
covered, and anything deferred. Newest phase at the bottom.

---

## Phase 1 — Stock data service layer  *(COMPLETE)*

**Provider decision:** No market data key existed in `.env`. Per the Phase 1
rule, stopped and asked; Hashim chose **Finnhub** (free tier, 60 calls/min,
real-time US quotes). Key added to `.env` as `FINNHUB_API_KEY`.

**Built:**
- `netlify/functions/quote.js` — server-side proxy to Finnhub `/quote`. In-memory
  cache keyed by ticker with a 60s TTL, so at most one upstream call per ticker
  per minute regardless of how many students are online. Accepts
  `?symbols=AAPL,MSFT`, caps at 50 per request, serves stale cache on upstream
  failure, marks unknown tickers `valid: false`.
- `src/lib/marketData.js` — the single source of truth for prices. `getQuote`,
  `getQuotes`, `valueHoldings`, `clearQuoteCache`. 30s client-side cache +
  in-flight de-duplication so a page render coalesces repeated reads. No page may
  hardcode a price or call a market API directly.

**3 verification passes — all clean (via `netlify dev`):**
- Pass A — `npm run build`: ✓ zero errors.
- Pass B — real quotes end-to-end through the function: ✓ live prices returned
  (AAPL 310.66, MSFT 388.84, NVDA 196.93, SPY 747.71); single + batch both work.
- Pass C — edge cases: ✓ invalid ticker returns `valid:false`; 2nd call inside
  60s returns `cached:true` with no second upstream hit; empty `?symbols=`
  returns HTTP 400; lowercase/whitespace/duplicate tickers normalized & deduped.

**Deferred / notes:**
- Finnhub free tier is US-equities only and one symbol per `/quote` call (no
  batch endpoint) — acceptable given caching. Historical/intraday series not
  implemented yet (not needed until charts).
- esbuild emits a cosmetic `commonjs-variable-in-esm` warning for `quote.js`
  (package is `"type":"module"`, function uses `exports.handler` like the
  already-live `groq.js`). Netlify's bundler handles it; function loads and runs.
  Left consistent with `groq.js` rather than diverging one function to `.cjs`.
- Local verification requires `netlify dev` (installed as devDependency); plain
  `npm run dev` (vite only) does not serve functions.

---
