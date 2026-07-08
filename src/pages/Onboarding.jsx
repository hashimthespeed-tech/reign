import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Lock, TrendingUp, Shield, Clock, Zap, Check, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes floatCrown {
  0%   { transform: translateY(0px); }
  100% { transform: translateY(-8px); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.reign-input {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  height: 52px;
  padding: 0 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: white;
  width: 100%;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.reign-input:focus {
  border-color: #00E87A;
  box-shadow: 0 0 0 3px rgba(0,232,122,0.15);
}
.reign-input::placeholder { color: rgba(255,255,255,0.3); }

.reign-btn {
  background: #E8B84B;
  color: #080C08;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  letter-spacing: 0.02em;
}
.reign-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.reign-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

.reign-tab {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 0;
  cursor: pointer;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.4);
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  flex: 1;
}
.reign-tab.active { color: #E8B84B; border-bottom-color: #E8B84B; }
.reign-tab:hover:not(.active) { color: rgba(255,255,255,0.7); }

.investor-card {
  background: #111A11;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  user-select: none;
}
.investor-card:hover { border-color: rgba(232,184,75,0.35); }
.investor-card.selected {
  border-color: #E8B84B;
  box-shadow: 0 0 20px rgba(232,184,75,0.2);
  background: rgba(232,184,75,0.06);
}

.stock-card {
  background: #111A11;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 16px 14px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  position: relative;
  user-select: none;
}
.stock-card:hover { border-color: rgba(0,232,122,0.3); }
.stock-card.selected {
  border: 1px solid #00E87A;
  box-shadow: 0 0 16px rgba(0,232,122,0.2);
}
.stock-card.maxed:not(.selected) { opacity: 0.35; pointer-events: none; }

.card-glow {
  box-shadow: 0 0 0 1px rgba(0,232,122,0.15), 0 0 30px rgba(0,232,122,0.12), 0 0 60px rgba(0,232,122,0.06);
}

.err-pill {
  color: #FF3333;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  margin-top: 8px;
  animation: fadeIn 0.2s ease;
  text-align: left;
}

.annotation-enter { animation: fadeInUp 400ms ease forwards; }
`

const STOCKS_DATA = [
  {
    category: 'TECH',
    stocks: [
      { ticker: 'AAPL', name: 'Apple Inc.' },
      { ticker: 'MSFT', name: 'Microsoft' },
      { ticker: 'GOOGL', name: 'Alphabet' },
      { ticker: 'NVDA', name: 'Nvidia' },
      { ticker: 'META', name: 'Meta' },
    ],
  },
  {
    category: 'CONSUMER',
    stocks: [
      { ticker: 'AMZN', name: 'Amazon' },
      { ticker: 'TSLA', name: 'Tesla' },
      { ticker: 'NKE', name: 'Nike' },
      { ticker: 'SBUX', name: 'Starbucks' },
      { ticker: 'MCD', name: "McDonald's" },
    ],
  },
  {
    category: 'FINANCE',
    stocks: [
      { ticker: 'JPM', name: 'JPMorgan' },
      { ticker: 'V', name: 'Visa' },
      { ticker: 'BAC', name: 'Bank of America' },
      { ticker: 'GS', name: 'Goldman Sachs' },
    ],
  },
  {
    category: 'ENERGY & OTHER',
    stocks: [
      { ticker: 'XOM', name: 'ExxonMobil' },
      { ticker: 'CVX', name: 'Chevron' },
      { ticker: 'DIS', name: 'Disney' },
      { ticker: 'NFLX', name: 'Netflix' },
      { ticker: 'PFE', name: 'Pfizer' },
      { ticker: 'SPY', name: 'S&P 500 ETF' },
    ],
  },
]

// ─── Step 0: Loading Screen ────────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080C08',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <div style={{ animation: 'floatCrown 3s ease-in-out infinite alternate' }}>
        <Crown
          size={80}
          color="#E8B84B"
          style={{ display: 'block', filter: 'drop-shadow(0 0 16px rgba(232,184,75,0.8))' }}
        />
      </div>
      <p style={{ marginTop: 20, color: 'white', fontWeight: 600, fontSize: 24, letterSpacing: '0.2em' }}>
        REIGN
      </p>
    </div>
  )
}

// ─── Step 1: Welcome ──────────────────────────────────────────────────────
function WelcomeStep({ onNext }) {
  const [crown, setCrown] = useState(false)
  const [line1, setLine1] = useState(false)
  const [line2, setLine2] = useState(false)
  const [btn, setBtn] = useState(false)

  useEffect(() => {
    setCrown(true)
    const t1 = setTimeout(() => setLine1(true), 400)
    const t2 = setTimeout(() => setLine2(true), 900)
    const t3 = setTimeout(() => setBtn(true), 1600)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  const tx = (show) => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    transition: 'opacity 500ms ease, transform 500ms ease',
  })

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '0 24px', width: '100%', maxWidth: 900,
    }}>
      <div style={{
        marginBottom: 48,
        opacity: crown ? 1 : 0,
        transform: crown ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 400ms ease, transform 400ms ease',
      }}>
        <Crown size={64} color="#E8B84B" style={{ filter: 'drop-shadow(0 0 16px rgba(232,184,75,0.8))' }} />
      </div>

      <h1 style={{
        color: 'white', fontWeight: 800,
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        lineHeight: 1.15, marginBottom: 20,
        ...tx(line1),
      }}>
        The market doesn't wait.<br />Neither should you.
      </h1>

      <p style={{
        color: 'rgba(255,255,255,0.6)', fontWeight: 400,
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        marginBottom: 56, maxWidth: 560,
        ...tx(line2),
      }}>
        Every decision you make from here is yours. Make them count.
      </p>

      <div style={{ opacity: btn ? 1 : 0, transition: 'opacity 500ms ease' }}>
        <button className="reign-btn" onClick={onNext} style={{ padding: '16px 64px', fontSize: 16 }}>
          Enter
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Auth ─────────────────────────────────────────────────────────
function AuthStep({ onNext, onSetUser }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const switchTab = (t) => { setTab(t); setError('') }

  const handleSignUp = async () => {
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const { data, error: err } = await supabase.auth.signUp({ email, password })
      if (err) throw err
      if (data.user) { onSetUser(data.user); onNext() }
    } catch {
      setError('Could not create account. Try a different email.')
    } finally { setLoading(false) }
  }

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      if (data.user) { onSetUser(data.user); navigate('/dashboard') }
    } catch {
      setError('Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Crown size={32} color="#E8B84B" style={{ filter: 'drop-shadow(0 0 12px rgba(232,184,75,0.7))' }} />
        <p style={{ color: 'white', fontWeight: 600, fontSize: 13, letterSpacing: '0.2em', marginTop: 8 }}>REIGN</p>
      </div>

      <div className="card-glow" style={{ background: '#111A11', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' }}>
          <button className={`reign-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>
            Join Reign
          </button>
          <button className={`reign-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
            I have an account
          </button>
        </div>

        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="reign-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="reign-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            {tab === 'signup' && (
              <input className="reign-input" type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            )}
          </div>

          {error && <p className="err-pill">{error}</p>}

          <button
            className="reign-btn"
            onClick={tab === 'signup' ? handleSignUp : handleLogin}
            disabled={loading || !email || !password || (tab === 'signup' && !confirm)}
            style={{ width: '100%', height: 52, fontSize: 15, marginTop: 20 }}
          >
            {loading ? 'Please wait…' : tab === 'signup' ? 'Create Account' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Class Code ──────────────────────────────────────────────────
function ClassCodeStep({ user, onNext, onFoundClass, onBudget }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [foundClass, setFoundClass] = useState(null)
  const [displayBudget, setDisplayBudget] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const countUp = (target) => {
    const start = performance.now()
    const duration = 1500
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplayBudget(Math.round(ease * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const handleSubmit = async () => {
    if (!code.trim()) return
    setError('')
    setLoading(true)
    try {
      const { data, error: dbErr } = await supabase
        .from('classes')
        .select('*')
        .ilike('class_code', code.trim())
        .single()

      if (dbErr || !data) {
        setError("That code doesn't exist. Check with your teacher.")
        setLoading(false)
        return
      }

      setFoundClass(data)
      onFoundClass(data)
      onBudget(data.budget ?? data.starting_budget ?? 10000)
      setSubmitted(true)

      setTimeout(() => {
        setRevealed(true)
        countUp(data.budget ?? data.starting_budget ?? 10000)
      }, 400)

      await supabase.from('class_requests').insert({
        student_id: user.id,
        class_id: data.id,
        status: 'pending',
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 560, textAlign: 'center', padding: '0 24px' }}>
      <h2 style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>
        Enter your class code.
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 40 }}>
        Your teacher gave you this code.
      </p>

      {!submitted && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <input
            className="reign-input"
            style={{
              maxWidth: 400, height: 64, fontSize: 24,
              letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center',
            }}
            placeholder="CLASS CODE"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          {error && <p className="err-pill" style={{ textAlign: 'center' }}>{error}</p>}
          <button
            className="reign-btn"
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            style={{ padding: '14px 48px', fontSize: 15 }}
          >
            {loading ? 'Checking…' : 'Submit Code'}
          </button>
        </div>
      )}

      {foundClass && (
        <div style={{
          marginTop: 40,
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 500ms ease, transform 500ms ease',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            {foundClass.class_name || foundClass.name}
          </p>
          {(foundClass.teacher_name || foundClass.teacher) && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 32 }}>
              with {foundClass.teacher_name || foundClass.teacher}
            </p>
          )}

          <p style={{ color: '#E8B84B', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', marginBottom: 8 }}>
            YOUR STARTING BUDGET
          </p>
          <p style={{
            color: 'white', fontWeight: 800,
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            textShadow: '0 0 40px rgba(0,232,122,0.3)',
            lineHeight: 1, marginBottom: 40,
          }}>
            ${displayBudget.toLocaleString()}
          </p>

          <button className="reign-btn" onClick={onNext} style={{ padding: '16px 56px', fontSize: 15 }}>
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Step 4: Identity ────────────────────────────────────────────────────
const INVESTOR_TYPES = [
  { id: 'aggressive', label: 'Aggressive', desc: 'High risk, high reward. You move fast.', Icon: Zap },
  { id: 'cautious',   label: 'Cautious',   desc: 'Slow and steady. You protect what you have.', Icon: Shield },
  { id: 'long_term',  label: 'Long Term',  desc: 'You think in years, not days.', Icon: Clock },
  { id: 'no_idea',    label: 'No idea yet',desc: "You're here to learn. That's enough.", Icon: TrendingUp },
]

function IdentityStep({ user, onNext }) {
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState(null) // null | 'checking' | 'available' | 'taken'
  const [investorType, setInvestorType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const debounce = useRef(null)

  const checkUsername = (val) => {
    if (!val || val.length < 2) { setUsernameStatus(null); return }
    setUsernameStatus('checking')
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from('profiles').select('id').eq('username', val).maybeSingle()
        setUsernameStatus(data ? 'taken' : 'available')
      } catch {
        setUsernameStatus('available')
      }
    }, 500)
  }

  const handleContinue = async () => {
    if (!username || usernameStatus !== 'available' || !investorType) return
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()

      console.log('Attempting profile save for user:', user.id)

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username,
          investor_type: investorType,
        })

      if (insertError && insertError.code !== '23505') {
        throw insertError
      }

      if (insertError && insertError.code === '23505') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ username, investor_type: investorType })
          .eq('id', user.id)
        if (updateError) throw updateError
      }

      onNext()
    } catch {
      setError('Could not save your profile. Please try again.')
    } finally { setLoading(false) }
  }

  const canContinue = username && usernameStatus === 'available' && investorType && !loading

  return (
    <div style={{ width: '100%', maxWidth: 640, padding: '0 24px' }}>
      <h2 style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 36, textAlign: 'center' }}>
        Who are you as an investor?
      </h2>

      <div style={{ marginBottom: 36 }}>
        <p style={{ color: '#E8B84B', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', marginBottom: 10 }}>
          CHOOSE YOUR NAME
        </p>
        <div style={{ position: 'relative' }}>
          <input
            className="reign-input"
            placeholder="Your investor name"
            value={username}
            onChange={e => { setUsername(e.target.value); checkUsername(e.target.value) }}
            style={{ paddingRight: 48 }}
          />
          {usernameStatus === 'available' && (
            <Check size={18} color="#00E87A" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} />
          )}
          {usernameStatus === 'taken' && (
            <X size={18} color="#FF3333" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} />
          )}
        </div>
        {usernameStatus === 'taken' && <p className="err-pill">That name is taken.</p>}
        {usernameStatus === 'checking' && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 6, fontFamily: 'Montserrat, sans-serif' }}>Checking…</p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        {INVESTOR_TYPES.map(({ id, label, desc, Icon }) => (
          <div
            key={id}
            className={`investor-card ${investorType === id ? 'selected' : ''}`}
            onClick={() => setInvestorType(id)}
          >
            <Icon size={22} color="#E8B84B" style={{ marginBottom: 10 }} />
            <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{label}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.45 }}>{desc}</p>
          </div>
        ))}
      </div>

      {error && <p className="err-pill" style={{ textAlign: 'center', marginBottom: 12 }}>{error}</p>}

      <button
        className="reign-btn"
        onClick={handleContinue}
        disabled={!canContinue}
        style={{ width: '100%', height: 52, fontSize: 15 }}
      >
        {loading ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

// ─── Step 5: Stock Picker ────────────────────────────────────────────────
function StockPickerStep({ user, foundClass, startingBudget, onNext }) {
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggle = (ticker) => {
    setSelected(prev => {
      if (prev.includes(ticker)) return prev.filter(t => t !== ticker)
      if (prev.length >= 5) return prev
      return [...prev, ticker]
    })
  }

  const handleContinue = async () => {
    if (selected.length < 2) return
    setLoading(true)
    setError('')
    try {
      const { data: portfolio, error: pErr } = await supabase
        .from('portfolios')
        .insert({ user_id: user.id, class_id: foundClass.id, cash_balance: startingBudget })
        .select()
        .single()
      if (pErr) throw pErr

      const { error: hErr } = await supabase.from('holdings').insert(
        selected.map(ticker => ({
          portfolio_id: portfolio.id,
          user_id: user.id,
          ticker,
          shares: 0,
          avg_buy_price: 0,
        }))
      )
      if (hErr) throw hErr
      onNext()
    } catch {
      setError('Could not save your portfolio. Please try again.')
    } finally { setLoading(false) }
  }

  const atMax = selected.length >= 5

  return (
    <div style={{
      width: '100%', maxWidth: 900, padding: '40px 24px',
      overflowY: 'auto', maxHeight: '100%',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>
          Build your first portfolio.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
          Pick 2 to 5 stocks to start with. No thesis required yet — that unlocks later.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span style={{ color: '#E8B84B', fontWeight: 700, fontSize: 14, fontFamily: 'Montserrat, sans-serif' }}>
          {selected.length} of 5 selected
        </span>
      </div>

      {STOCKS_DATA.map(({ category, stocks }) => (
        <div key={category} style={{ marginBottom: 28 }}>
          <p style={{
            color: '#E8B84B', fontWeight: 700, fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: 12, fontFamily: 'Montserrat, sans-serif',
          }}>
            {category}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {stocks.map(({ ticker, name }) => {
              const isSelected = selected.includes(ticker)
              return (
                <div
                  key={ticker}
                  className={`stock-card ${isSelected ? 'selected' : ''} ${atMax && !isSelected ? 'maxed' : ''}`}
                  onClick={() => toggle(ticker)}
                >
                  {isSelected && (
                    <Check size={13} color="#00E87A" style={{ position: 'absolute', top: 9, right: 9 }} />
                  )}
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 3, fontFamily: 'Montserrat, sans-serif' }}>
                    {ticker}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.35, fontFamily: 'Montserrat, sans-serif' }}>
                    {name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {error && <p className="err-pill" style={{ textAlign: 'center', marginBottom: 12 }}>{error}</p>}

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button
          className="reign-btn"
          onClick={handleContinue}
          disabled={loading || selected.length < 2}
          style={{ padding: '16px 56px', fontSize: 15 }}
        >
          {loading ? 'Building portfolio…' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

// ─── Step 6: Dashboard Reveal ────────────────────────────────────────────
const ANNOTATIONS = [
  {
    cardId: 0,
    text: 'This is your portfolio. Every decision you make moves this number.',
    tipPos: { top: '14%', left: '50%', transform: 'translateX(-50%)' },
  },
  {
    cardId: 1,
    text: 'This is your rank in your class. Everyone starts somewhere.',
    tipPos: { top: '14%', right: '24px' },
  },
  {
    cardId: 2,
    text: 'After market close, your report appears here. Check it every day.',
    tipPos: { top: '14%', left: '24px' },
  },
  {
    cardId: 3,
    text: 'Some features are locked. Keep showing up to unlock them.',
    tipPos: { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
  },
]

function DashboardReveal({ onDone }) {
  const [step, setStep] = useState(0)
  const [tipKey, setTipKey] = useState(0)

  const handleGotIt = () => {
    if (step === ANNOTATIONS.length - 1) { onDone(); return }
    setStep(s => s + 1)
    setTipKey(k => k + 1)
  }

  const spotlight = (cardId) => step === cardId ? {
    position: 'relative',
    zIndex: 100,
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
    borderRadius: 12,
  } : {
    position: 'relative', zIndex: 1,
  }

  const cur = ANNOTATIONS[step]

  const LOCKED = ['AI Market Analysis', 'Trade History', 'Thesis Builder']

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080C08',
      fontFamily: "'Montserrat', sans-serif",
      overflowY: 'auto', overflowX: 'visible',
    }}>
      {/* Mock dashboard */}
      <div style={{ padding: '24px 24px 80px', minHeight: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Crown size={22} color="#E8B84B" style={{ filter: 'drop-shadow(0 0 8px rgba(232,184,75,0.6))' }} />
            <span style={{ color: 'white', fontWeight: 700, letterSpacing: '0.12em', fontSize: 14 }}>REIGN</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Dashboard</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          {/* Portfolio Value */}
          <div style={{ ...spotlight(0), background: '#111A11', borderRadius: 12, padding: 24, border: '1px solid rgba(0,232,122,0.15)' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.1em', marginBottom: 10 }}>PORTFOLIO VALUE</p>
            <p style={{ color: 'white', fontWeight: 800, fontSize: 36 }}>$10,000</p>
            <p style={{ color: '#00E87A', fontSize: 13, marginTop: 6 }}>+0.00% today</p>
          </div>

          {/* Leaderboard rank */}
          <div style={{ ...spotlight(1), background: '#111A11', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.1em', marginBottom: 10 }}>CLASS RANK</p>
            <p style={{ color: '#E8B84B', fontWeight: 800, fontSize: 36 }}>#1</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 6 }}>of your class</p>
          </div>

          {/* Daily report */}
          <div style={{ ...spotlight(2), background: '#111A11', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.1em', marginBottom: 10 }}>DAILY REPORT</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
              Available after<br />market close
            </p>
          </div>
        </div>

        {/* Locked features */}
        <div style={{
          ...spotlight(3),
          background: '#111A11',
          borderRadius: 12, padding: 20,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.1em', marginBottom: 14 }}>FEATURES</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {LOCKED.map((feat, i) => (
              <div key={feat} style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                opacity: 0.45,
              }}>
                <Lock size={15} color="rgba(255,255,255,0.35)" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>{feat}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
                    Unlocks in {(i + 1) * 7} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annotation tooltip */}
      <div
        key={tipKey}
        className="annotation-enter"
        style={{
          position: 'fixed',
          zIndex: 200,
          ...cur.tipPos,
        }}
      >
        <div style={{
          background: '#111A11',
          border: '1px solid rgba(0,232,122,0.3)',
          borderRadius: 14,
          padding: '20px 22px',
          maxWidth: 320,
          boxShadow: '0 0 0 1px rgba(0,232,122,0.12), 0 12px 48px rgba(0,0,0,0.7)',
        }}>
          <p style={{ color: 'white', fontSize: 15, lineHeight: 1.55, marginBottom: 16, fontWeight: 500 }}>
            {cur.text}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
              {step + 1} / {ANNOTATIONS.length}
            </span>
            <button
              className="reign-btn"
              onClick={handleGotIt}
              style={{ padding: '10px 22px', fontSize: 14 }}
            >
              {step === ANNOTATIONS.length - 1 ? "Let's go →" : 'Got It'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Onboarding ─────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [user, setUser] = useState(null)
  const [foundClass, setFoundClass] = useState(null)
  const [startingBudget, setStartingBudget] = useState(10000)

  // Inject styles once
  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = STYLES
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  const goToStep = (step) => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrentStep(step)
      setTransitioning(false)
    }, 300)
  }

  // Steps 0 and 6 are full-screen self-contained
  if (currentStep === 0) return <LoadingScreen onDone={() => goToStep(1)} />
  if (currentStep === 6) return <DashboardReveal onDone={() => navigate('/dashboard')} />

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080C08',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Montserrat', sans-serif",
      overflowY: 'auto',
      opacity: transitioning ? 0 : 1,
      transform: transitioning ? 'translateY(-20px)' : 'translateY(0)',
      transition: transitioning
        ? 'opacity 300ms ease, transform 300ms ease'
        : 'opacity 400ms ease, transform 400ms ease',
    }}>
      {currentStep === 1 && <WelcomeStep onNext={() => goToStep(2)} />}

      {currentStep === 2 && (
        <AuthStep
          onNext={() => goToStep(3)}
          onSetUser={setUser}
        />
      )}

      {currentStep === 3 && (
        <ClassCodeStep
          user={user}
          onNext={() => goToStep(4)}
          onFoundClass={setFoundClass}
          onBudget={setStartingBudget}
        />
      )}

      {currentStep === 4 && (
        <IdentityStep
          user={user}
          onNext={() => goToStep(5)}
        />
      )}

      {currentStep === 5 && (
        <StockPickerStep
          user={user}
          foundClass={foundClass}
          startingBudget={startingBudget}
          onNext={() => goToStep(6)}
        />
      )}
    </div>
  )
}
