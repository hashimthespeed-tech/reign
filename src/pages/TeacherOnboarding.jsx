import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, GraduationCap, Users, Settings, CheckCircle } from 'lucide-react'
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

@keyframes codePulse {
  0%, 100% { box-shadow: 0 0 0 1px rgba(0,232,122,0.15), 0 0 20px rgba(0,232,122,0.2), 0 0 40px rgba(0,232,122,0.06); }
  50%       { box-shadow: 0 0 0 1px rgba(0,232,122,0.35), 0 0 40px rgba(0,232,122,0.4), 0 0 80px rgba(0,232,122,0.12); }
}

.t-input {
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
.t-input:focus {
  border-color: #00E87A;
  box-shadow: 0 0 0 3px rgba(0,232,122,0.15);
}
.t-input::placeholder { color: rgba(255,255,255,0.3); }
.t-input[type=number]::-webkit-inner-spin-button,
.t-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

.t-btn {
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
.t-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.t-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

.t-btn-outline {
  background: transparent;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
  letter-spacing: 0.02em;
}
.t-btn-outline:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.04); }
.t-btn-outline.copied { border-color: #00E87A; color: #00E87A; }

.t-tab {
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
.t-tab.active { color: #E8B84B; border-bottom-color: #E8B84B; }
.t-tab:hover:not(.active) { color: rgba(255,255,255,0.7); }

.acct-card {
  background: #111A11;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  flex: 1;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  user-select: none;
}
.acct-card:hover { border-color: rgba(232,184,75,0.35); }
.acct-card.selected {
  border-color: #E8B84B;
  box-shadow: 0 0 20px rgba(232,184,75,0.2);
  background: rgba(232,184,75,0.06);
}

.card-glow {
  box-shadow: 0 0 0 1px rgba(0,232,122,0.15), 0 0 30px rgba(0,232,122,0.12), 0 0 60px rgba(0,232,122,0.06);
}

.t-err { color: #FF3333; font-family: 'Montserrat', sans-serif; font-size: 13px; margin-top: 8px; animation: fadeIn 0.2s ease; }

.code-pulse { animation: codePulse 2s ease-in-out infinite; }
`

// ─── Toggle ───────────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 48, height: 24, borderRadius: 12, flexShrink: 0,
        background: on ? '#00E87A' : 'rgba(255,255,255,0.1)',
        boxShadow: on ? '0 0 10px rgba(0,232,122,0.4)' : 'none',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.25s, box-shadow 0.25s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2,
        left: on ? 26 : 2,
        width: 20, height: 20, borderRadius: '50%',
        background: 'white',
        transition: 'left 0.25s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
      }} />
    </div>
  )
}

// ─── Step 0: Loading ──────────────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#080C08',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <div style={{ animation: 'floatCrown 3s ease-in-out infinite alternate' }}>
        <Crown size={80} color="#E8B84B" style={{ display: 'block', filter: 'drop-shadow(0 0 16px rgba(232,184,75,0.8))' }} />
      </div>
      <p style={{ marginTop: 20, color: 'white', fontWeight: 600, fontSize: 24, letterSpacing: '0.2em' }}>REIGN</p>
    </div>
  )
}

// ─── Step 1: Welcome ─────────────────────────────────────────────────────
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
    transform: show ? 'translateY(0)' : 'translateY(20px)',
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
        Your classroom. Your rules.
      </h1>

      <p style={{
        color: 'rgba(255,255,255,0.6)', fontWeight: 400,
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        marginBottom: 56, maxWidth: 520,
        ...tx(line2),
      }}>
        Set up your class in minutes. Your students take it from there.
      </p>

      <div style={{ opacity: btn ? 1 : 0, transition: 'opacity 500ms ease' }}>
        <button className="t-btn" onClick={onNext} style={{ padding: '16px 64px', fontSize: 16 }}>
          Get Started
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
      if (data.user) { onSetUser(data.user); navigate('/teacher') }
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
          <button className={`t-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>
            Create Account
          </button>
          <button className={`t-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
            I have an account
          </button>
        </div>

        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="t-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="t-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            {tab === 'signup' && (
              <input className="t-input" type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            )}
          </div>

          {error && <p className="t-err">{error}</p>}

          <button
            className="t-btn"
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

// ─── Step 3: Teacher Profile ──────────────────────────────────────────────
function ProfileStep({ user, onNext }) {
  const [fullName, setFullName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = async () => {
    if (!fullName.trim() || !schoolName.trim()) { setError('Please fill in both fields.'); return }
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()

      console.log('Attempting profile save for user:', user.id)

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: fullName,
          investor_type: 'teacher',
        })

      if (insertError && insertError.code !== '23505') {
        throw insertError
      }

      if (insertError && insertError.code === '23505') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ username: fullName, investor_type: 'teacher' })
          .eq('id', user.id)
        if (updateError) throw updateError
      }

      onNext()
    } catch {
      setError('Could not save your profile. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 24px' }}>
      <h2 style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 36, textAlign: 'center' }}>
        Tell us about yourself.
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
        <div>
          <p style={{ color: '#E8B84B', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', marginBottom: 10 }}>YOUR NAME</p>
          <input
            className="t-input"
            placeholder="Full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>
        <div>
          <p style={{ color: '#E8B84B', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', marginBottom: 10 }}>SCHOOL NAME</p>
          <input
            className="t-input"
            placeholder="Your school"
            value={schoolName}
            onChange={e => setSchoolName(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="t-err" style={{ textAlign: 'center', marginBottom: 12 }}>{error}</p>}

      <button
        className="t-btn"
        onClick={handleContinue}
        disabled={loading || !fullName.trim() || !schoolName.trim()}
        style={{ width: '100%', height: 52, fontSize: 15 }}
      >
        {loading ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

// ─── Step 4: Create Class ─────────────────────────────────────────────────
const ACCOUNT_TYPES = [
  { id: 'standard',  label: 'Standard',  desc: 'No tax implications. Simple trading.' },
  { id: 'roth_ira',  label: 'Roth IRA',  desc: 'Tax-free growth simulation.' },
  { id: '401k',      label: '401k',      desc: 'Pre-tax contributions simulation.' },
]

function CreateClassStep({ className, setClassName, budget, setBudget, accountType, setAccountType, taxEnabled, setTaxEnabled, onNext }) {
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (!className.trim()) { setError('Please enter a class name.'); return }
    if (!budget || budget < 1000) { setError('Minimum starting budget is $1,000.'); return }
    setError('')
    onNext()
  }

  const displayBudget = Number(budget) > 0 ? Number(budget).toLocaleString() : '0'

  return (
    <div style={{ width: '100%', maxWidth: 580, padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>
          Create your class.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>You can create more classes later.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Class Name */}
        <div>
          <p style={{ color: '#E8B84B', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', marginBottom: 10 }}>CLASS NAME</p>
          <input
            className="t-input"
            placeholder="e.g. Period 3 Finance"
            value={className}
            onChange={e => setClassName(e.target.value)}
          />
        </div>

        {/* Starting Budget */}
        <div>
          <p style={{ color: '#E8B84B', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', marginBottom: 10 }}>STARTING BUDGET</p>
          <input
            className="t-input"
            type="number"
            min={1000}
            max={100000}
            value={budget}
            onChange={e => setBudget(Math.min(100000, Math.max(0, Number(e.target.value))))}
          />
          {Number(budget) > 0 && (
            <p style={{
              color: '#E8B84B', fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600, fontSize: 13, marginTop: 8,
              animation: 'fadeIn 0.2s ease',
            }}>
              Each student starts with ${displayBudget}
            </p>
          )}
        </div>

        {/* Account Type */}
        <div>
          <p style={{ color: '#E8B84B', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', marginBottom: 12 }}>ACCOUNT TYPE</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {ACCOUNT_TYPES.map(({ id, label, desc }) => (
              <div
                key={id}
                className={`acct-card ${accountType === id ? 'selected' : ''}`}
                onClick={() => setAccountType(id)}
              >
                <p style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 6, fontFamily: "'Montserrat', sans-serif" }}>
                  {label}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.4, fontFamily: "'Montserrat', sans-serif" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Toggle */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: 14, fontFamily: "'Montserrat', sans-serif" }}>
                Enable tax simulation
              </p>
            </div>
            <Toggle on={taxEnabled} onChange={setTaxEnabled} />
          </div>

          {taxEnabled && (
            <div style={{
              marginTop: 12,
              background: 'rgba(232,184,75,0.04)',
              border: '1px solid rgba(232,184,75,0.25)',
              borderRadius: 8, padding: '12px 16px',
              animation: 'fadeIn 0.25s ease',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.5, fontFamily: "'Montserrat', sans-serif" }}>
                Students will see how taxes affect their returns in different account types.
              </p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="t-err" style={{ textAlign: 'center', marginTop: 12 }}>{error}</p>}

      <button
        className="t-btn"
        onClick={handleContinue}
        disabled={!className.trim() || !budget || Number(budget) < 1000}
        style={{ width: '100%', height: 52, fontSize: 15, marginTop: 28 }}
      >
        Continue
      </button>
    </div>
  )
}

// ─── Step 5: Class Settings ───────────────────────────────────────────────
const SETTING_ROWS = [
  { key: 'dailyPredictions', label: 'Require daily predictions',  desc: 'Students must make a prediction before market open each day.' },
  { key: 'showLeaderboard',  label: 'Show class leaderboard',     desc: 'All students can see the full rankings.' },
  { key: 'allowShortSelling',label: 'Allow short selling',        desc: 'Students can bet against stocks.' },
  { key: 'thesisRequired',   label: 'Thesis required to buy',     desc: 'Students must write a thesis before purchasing. Unlocks after 10 days by default.' },
  { key: 'showRealMoney',    label: 'Show real money option',     desc: 'Show students the option to transition to real investing.' },
]

function ClassSettingsStep({ settings, setSettings, user, className, budget, accountType, taxEnabled, onNext, setGeneratedCode, setCreatedClassId }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      const classData = {
        name: className,
        teacher_id: user.id,
        class_code: code,
        starting_budget: budget,
        account_type: accountType,
        tax_enabled: taxEnabled,
        daily_predictions: settings.dailyPredictions,
        show_leaderboard: settings.showLeaderboard,
        allow_short_selling: settings.allowShortSelling,
        thesis_required: settings.thesisRequired,
        show_real_money: settings.showRealMoney,
      }
      console.log('Inserting class data:', JSON.stringify(classData))
      const { data, error: dbErr } = await supabase.from('classes').insert(classData).select().single()

      if (dbErr) {
        console.log('Class insert error:', JSON.stringify(dbErr))
        throw dbErr
      }
      setGeneratedCode(code)
      setCreatedClassId(data.id)
      onNext()
    } catch {
      setError('Could not create your class. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ width: '100%', maxWidth: 560, padding: '0 24px' }}>
      <h2 style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 32, textAlign: 'center' }}>
        Customize your class.
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {SETTING_ROWS.map(({ key, label, desc }, i) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '18px 0',
            borderBottom: i < SETTING_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 3, fontFamily: "'Montserrat', sans-serif" }}>
                {label}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.45, fontFamily: "'Montserrat', sans-serif" }}>
                {desc}
              </p>
            </div>
            <Toggle on={settings[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>

      {error && <p className="t-err" style={{ textAlign: 'center', marginTop: 16, marginBottom: 4 }}>{error}</p>}

      <button
        className="t-btn"
        onClick={handleCreate}
        disabled={loading}
        style={{ width: '100%', height: 52, fontSize: 15, marginTop: 28 }}
      >
        {loading ? 'Creating class…' : 'Create Class'}
      </button>
    </div>
  )
}

// ─── Step 6: Code Reveal ──────────────────────────────────────────────────
function CodeRevealStep({ generatedCode }) {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200)
    return () => clearTimeout(t)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = generatedCode
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '0 24px', width: '100%', maxWidth: 640,
    }}>
      {/* Crown */}
      <div style={{
        marginBottom: 40,
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 400ms ease, transform 400ms ease',
        animation: show ? 'floatCrown 3s ease-in-out infinite alternate' : 'none',
      }}>
        <Crown size={64} color="#E8B84B" style={{ filter: 'drop-shadow(0 0 16px rgba(232,184,75,0.8))' }} />
      </div>

      {/* Code block */}
      <div style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 500ms ease 200ms, transform 500ms ease 200ms',
        width: '100%', marginBottom: 32,
      }}>
        <p style={{
          color: '#E8B84B', fontWeight: 700, fontSize: 12,
          letterSpacing: '0.12em', marginBottom: 20,
          fontFamily: "'Montserrat', sans-serif",
        }}>
          YOUR CLASS CODE
        </p>

        <div className="code-pulse" style={{
          background: '#111A11', borderRadius: 16,
          padding: '32px 40px', display: 'inline-block',
        }}>
          <p style={{
            color: 'white', fontWeight: 800, fontSize: 80,
            letterSpacing: '0.3em',
            textShadow: '0 0 40px rgba(0,232,122,0.4)',
            fontFamily: "'Montserrat', sans-serif",
            lineHeight: 1,
          }}>
            {generatedCode}
          </p>
        </div>

        <p style={{
          color: 'rgba(255,255,255,0.5)', fontSize: 16, marginTop: 20,
          fontFamily: "'Montserrat', sans-serif",
        }}>
          Share this code with your students to let them join.
        </p>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 28,
        opacity: show ? 1 : 0,
        transition: 'opacity 500ms ease 400ms',
        flexWrap: 'wrap',
      }}>
        <button
          className={`t-btn-outline ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          style={{ padding: '14px 36px', fontSize: 15, minWidth: 160 }}
        >
          {copied ? 'Copied ✓' : 'Copy Code'}
        </button>
        <button
          className="t-btn"
          onClick={() => navigate('/teacher')}
          style={{ padding: '14px 36px', fontSize: 15, minWidth: 160 }}
        >
          Go to Dashboard
        </button>
      </div>

      {/* Info card */}
      <div style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 500ms ease 600ms',
        background: 'rgba(0,232,122,0.04)',
        borderLeft: '3px solid #00E87A',
        borderRadius: 8, padding: '14px 18px',
        maxWidth: 480, textAlign: 'left',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6, fontFamily: "'Montserrat', sans-serif" }}>
          Students who enter this code will appear in your dashboard as pending requests.
          You approve each one before they join.
        </p>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function TeacherOnboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [user, setUser] = useState(null)

  // Class data
  const [className, setClassName] = useState('')
  const [budget, setBudget] = useState(10000)
  const [accountType, setAccountType] = useState('standard')
  const [taxEnabled, setTaxEnabled] = useState(false)
  const [settings, setSettings] = useState({
    dailyPredictions: true,
    showLeaderboard: true,
    allowShortSelling: false,
    thesisRequired: false,
    showRealMoney: true,
  })
  const [generatedCode, setGeneratedCode] = useState('')
  const [createdClassId, setCreatedClassId] = useState(null)

  // Inject styles
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

  if (currentStep === 0) return <LoadingScreen onDone={() => goToStep(1)} />

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
        <ProfileStep
          user={user}
          onNext={() => goToStep(4)}
        />
      )}

      {currentStep === 4 && (
        <CreateClassStep
          className={className} setClassName={setClassName}
          budget={budget} setBudget={setBudget}
          accountType={accountType} setAccountType={setAccountType}
          taxEnabled={taxEnabled} setTaxEnabled={setTaxEnabled}
          onNext={() => goToStep(5)}
        />
      )}

      {currentStep === 5 && (
        <ClassSettingsStep
          settings={settings} setSettings={setSettings}
          user={user}
          className={className}
          budget={budget}
          accountType={accountType}
          taxEnabled={taxEnabled}
          onNext={() => goToStep(6)}
          setGeneratedCode={setGeneratedCode}
          setCreatedClassId={setCreatedClassId}
        />
      )}

      {currentStep === 6 && (
        <CodeRevealStep generatedCode={generatedCode} />
      )}
    </div>
  )
}
