import { useState, useEffect, useRef } from 'react';
import {
  Crown, TrendingUp, TrendingDown, Trophy, Sparkles,
  Flame, Zap, Lock, Target, CheckCircle, AlertCircle,
} from 'lucide-react';

/* ─── Global CSS ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: #080C08;
    color: #fff;
    font-family: 'Montserrat', sans-serif;
    overflow-x: hidden;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  }

  :root {
    --space-4: 4px; --space-8: 8px; --space-16: 16px; --space-24: 24px;
    --space-32: 32px; --space-48: 48px; --space-64: 64px; --space-80: 80px; --space-120: 120px;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080C08; }
  ::-webkit-scrollbar-thumb { background: #12A050; border-radius: 3px; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px #00E87A22; }
    50% { box-shadow: 0 0 40px #00E87A55; }
  }
  @keyframes ticker-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes float {
    from { transform: translateY(0px); }
    to { transform: translateY(-8px); }
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(176,32,32,0.7); }
    70% { box-shadow: 0 0 0 8px rgba(176,32,32,0); }
    100% { box-shadow: 0 0 0 0 rgba(176,32,32,0); }
  }

  .pulse-anim { animation: pulse-glow 3s ease-in-out infinite; }

  .live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #B02020; animation: pulse 1.5s infinite; flex-shrink: 0;
  }
  .crown-float { animation: float 3s ease-in-out infinite alternate; }

  .fade-up { opacity: 0; transform: translateY(20px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  .fade-up-delay-1 { transition-delay: 80ms; }
  .fade-up-delay-2 { transition-delay: 160ms; }
  .fade-up-delay-3 { transition-delay: 240ms; }
  .fade-up-delay-4 { transition-delay: 320ms; }
  .fade-up-delay-5 { transition-delay: 400ms; }

  .btn-gold {
    background: #E8B84B;
    color: #0D3320;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700; font-size: 16px; letter-spacing: 0.06em;
    padding: 16px 40px; border: none; border-radius: 8px;
    cursor: pointer; transition: all 200ms ease-out;
  }
  .btn-gold:hover {
    background: #F0C55A;
    box-shadow: 0 0 24px rgba(232,184,75,0.4);
    transform: translateY(-1px);
  }
  .btn-outline {
    background: transparent; color: #fff;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700; font-size: 16px; letter-spacing: 0.06em;
    padding: 16px 40px; border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px; cursor: pointer; transition: all 200ms ease-out;
  }
  .btn-outline:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.04); }

  .btn-predict-up {
    flex: 1; padding: 15px 0; border-radius: 8px;
    font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 16px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: rgba(0,232,122,0.15); border: 1.5px solid #00E87A;
    color: white; box-shadow: 0 0 20px rgba(0,232,122,0.2);
    transition: all 0.2s;
  }
  .btn-predict-up:hover {
    background: rgba(0,232,122,0.25);
    box-shadow: 0 0 30px rgba(0,232,122,0.35);
    transform: translateY(-1px);
  }
  .btn-predict-down {
    flex: 1; padding: 15px 0; border-radius: 8px;
    font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 16px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: rgba(255,51,51,0.15); border: 1.5px solid #FF3333;
    color: white; box-shadow: 0 0 20px rgba(255,51,51,0.2);
    transition: all 0.2s;
  }
  .btn-predict-down:hover {
    background: rgba(255,51,51,0.25);
    box-shadow: 0 0 30px rgba(255,51,51,0.35);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .two-col { grid-template-columns: 1fr !important; }
    .four-col { grid-template-columns: 1fr 1fr !important; }
    .three-col { grid-template-columns: 1fr !important; }
    .hide-mobile { display: none !important; }
    .stats-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  }
  @media (max-width: 480px) { .four-col { grid-template-columns: 1fr !important; } }

  @media (prefers-reduced-motion: reduce) {
    .fade-up, .fade-up.visible { opacity: 1 !important; transform: none !important; transition: none !important; }
    .crown-float, .live-dot, .pulse-anim { animation: none !important; }
  }
`;

/* ─── Design tokens ─── */
const C = {
  bg: '#080C08',
  bgAlt: '#090D09',
  surface: '#111A11',
  green: '#12A050',
  glow: '#00E87A',
  gold: '#E8B84B',
  red: '#B02020',
};

/* ─── Shadow helpers (FIX 1) ─── */
const SHADOW_GREEN = '0 0 0 1px rgba(0,232,122,0.15), 0 0 30px rgba(0,232,122,0.12), 0 0 60px rgba(0,232,122,0.06)';
const SHADOW_GOLD  = '0 0 0 1px rgba(232,184,75,0.25), 0 0 30px rgba(232,184,75,0.15), 0 0 60px rgba(232,184,75,0.08)';
const SHADOW_RED   = '0 0 0 1px rgba(176,32,32,0.25), 0 0 30px rgba(176,32,32,0.12), 0 0 60px rgba(176,32,32,0.06)';
const SHADOW_YOU   = '0 0 0 1px rgba(0,232,122,0.4), 0 0 40px rgba(0,232,122,0.2), 0 0 80px rgba(0,232,122,0.1)';
const SHADOW_RANK1 = '0 0 0 1px rgba(232,184,75,0.1), 0 0 40px rgba(232,184,75,0.15), 0 0 80px rgba(232,184,75,0.08)';

/* ─── Hooks ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, active, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, target, duration]);
  return val;
}

function useFadeUpObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Primitives ─── */
function ReignCard({ children, accent = C.green, bg, style = {} }) {
  const isGold = accent === C.gold || accent === '#FFD700';
  const isRed  = accent === C.red;

  const borderColor = isGold ? '#E8B84B' : isRed ? '#FF3333' : accent === C.green ? '#00E87A' : 'rgba(255,255,255,0.15)';
  const defaultShadow = isGold ? SHADOW_GOLD : isRed ? SHADOW_RED : SHADOW_GREEN;

  return (
    <div style={{
      background: bg || C.surface,
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: 10,
      boxShadow: defaultShadow,
      padding: '20px 24px',
      position: 'relative',
      ...style,
    }}>
      <span style={{
        position: 'absolute', top: 14, right: 14,
        width: 8, height: 8, borderRadius: '50%',
        background: accent, boxShadow: `0 0 8px ${accent}`,
        display: 'block', flexShrink: 0,
      }} />
      {children}
    </div>
  );
}

function Logo({ size = 32 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Crown style={{
        width: size * 1.1, height: size * 1.1,
        color: '#E8B84B',
        filter: 'drop-shadow(0 0 8px rgba(232,184,75,0.5))',
        flexShrink: 0,
      }} />
      <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: size, letterSpacing: '0.16em', color: '#fff' }}>REIGN</span>
    </div>
  );
}

function SectionLabel({ children, color = C.green }) {
  return (
    <span style={{
      display: 'inline-block', background: color + '22', border: `1px solid ${color}44`,
      borderRadius: 4, padding: '4px 12px', fontSize: '0.75rem', letterSpacing: '0.12em',
      fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase',
    }}>{children}</span>
  );
}

/* ─── NavBar ─── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      padding: '14px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(8,12,8,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
      transition: 'all 0.35s ease',
    }}>
      <Logo size={22} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn-outline" style={{ padding: '8px 18px', fontSize: 13 }}>Create Class</button>
        <button className="btn-gold" style={{ padding: '8px 18px', fontSize: 13 }}>Join Class</button>
      </div>
      {/* FIX 8 — gradient separator line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(0,232,122,0.4), rgba(232,184,75,0.4), rgba(0,232,122,0.4), transparent)',
      }} />
    </nav>
  );
}

/* ─── Ticker ─── */
const TICKER_DATA = [
  { sym: 'AAPL', val: '+2.1%', up: true }, { sym: 'NVDA', val: '-3.4%', up: false },
  { sym: 'TSLA', val: '+1.8%', up: true }, { sym: 'MSFT', val: '+0.6%', up: true },
  { sym: 'AMZN', val: '-0.9%', up: false }, { sym: 'GOOGL', val: '+1.2%', up: true },
  { sym: 'META', val: '+3.1%', up: true }, { sym: 'NFLX', val: '-2.0%', up: false },
  { sym: 'SPY', val: '+0.4%', up: true }, { sym: 'BTC', val: '+4.8%', up: true },
];

function Ticker() {
  const items = [...TICKER_DATA, ...TICKER_DATA];
  return (
    <div style={{ overflow: 'hidden', background: '#071D10', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
      <div style={{ display: 'flex', gap: 48, animation: 'ticker-scroll 28s linear infinite', width: 'max-content' }}>
        {items.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: '0.06em' }}>{t.sym}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {t.up
                ? <TrendingUp style={{ width: 14, height: 14, color: '#00E87A', filter: 'drop-shadow(0 0 4px #00E87A)' }} />
                : <TrendingDown style={{ width: 14, height: 14, color: '#B02020' }} />
              }
              <span style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{t.val}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section 1: Hero ─── */
function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh',
      background: '#080C08',
      backgroundImage: `
        radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,232,122,0.12) 0%, transparent 70%),
        radial-gradient(ellipse 40% 30% at 50% 10%, rgba(232,184,75,0.06) 0%, transparent 60%)
      `,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '120px 64px 80px', position: 'relative',
    }}>
      <div style={{ marginBottom: 36 }} className="crown-float">
        <Crown style={{
          width: 64, height: 64, color: '#E8B84B',
          filter: 'drop-shadow(0 0 16px rgba(232,184,75,0.8)) drop-shadow(0 0 32px rgba(232,184,75,0.4)) drop-shadow(0 0 64px rgba(232,184,75,0.2))',
        }} />
      </div>

      <h1 className="fade-up" style={{
        fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.05,
        color: '#fff', maxWidth: 820, marginBottom: 28, letterSpacing: '-0.02em',
      }}>
        <span style={{ textShadow: '0 0 80px rgba(0,232,122,0.15)' }}>The market doesn't wait.</span><br />
        Neither should you.
      </h1>

      <p className="fade-up fade-up-delay-1" style={{
        fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: '1.25rem',
        color: 'rgba(255,255,255,0.5)', marginBottom: 52, maxWidth: 480, lineHeight: 1.5, letterSpacing: '0.01em',
      }}>
        Learn to invest before anyone else does.
      </p>

      <div className="fade-up fade-up-delay-2" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn-gold">Join Your Class</button>
        <button className="btn-outline">Create a Class</button>
      </div>
    </section>
  );
}

/* ─── Section 2: Live Demo ─── */
const DEMO_STOCKS = [
  { sym: 'AAPL', name: 'Apple Inc.', price: '$189.42', chg: '+2.1%', amt: '+$204.80', up: true },
  { sym: 'TSLA', name: 'Tesla Inc.', price: '$248.10', chg: '-1.8%', amt: '-$180.20', up: false },
  { sym: 'MSFT', name: 'Microsoft', price: '$378.90', chg: '+0.9%', amt: '+$90.60', up: true },
];
const DEMO_LEADERBOARD = [
  { rank: 1, name: 'Jordan K.', val: '$12,847', chg: '+28.5%' },
  { rank: 2, name: 'Priya S.', val: '$11,923', chg: '+19.2%' },
  { rank: 3, name: 'Marcus T.', val: '$11,445', chg: '+14.5%' },
  { rank: 4, name: 'YOU', val: '$10,892', chg: '+8.9%', isYou: true },
  { rank: 5, name: 'Emma R.', val: '$10,234', chg: '+2.3%' },
  { rank: 6, name: 'Liam N.', val: '$9,876', chg: '-1.2%' },
];

function ChgDisplay({ chg }) {
  const up = chg.startsWith('+');
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: up ? '#00E87A' : '#B02020',
        boxShadow: up ? '0 0 6px #00E87A' : '0 0 6px #B02020',
      }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{chg}</span>
    </span>
  );
}

function lbRowStyle(row, i) {
  if (i === 0) return {
    background: 'linear-gradient(135deg, rgba(232,184,75,0.15) 0%, rgba(17,26,17,1) 60%)',
    border: '1px solid rgba(232,184,75,0.3)', borderLeft: '3px solid #E8B84B',
    boxShadow: SHADOW_RANK1, minHeight: 88,
  };
  if (row.isYou) return {
    background: '#1A5030', border: `1px solid ${C.green}`, boxShadow: SHADOW_YOU,
  };
  if (i < 3) return {
    background: '#162E22', border: `1px solid ${C.gold}33`, boxShadow: SHADOW_GOLD,
  };
  return { background: C.surface, border: '1px solid transparent', boxShadow: SHADOW_GREEN };
}

function LbTrophy({ i }) {
  if (i === 0) return <Trophy style={{ width: 28, height: 28, color: '#E8B84B', filter: 'drop-shadow(0 0 8px rgba(232,184,75,0.6))' }} />;
  if (i < 3) return <Trophy style={{ width: 20, height: 20, color: C.gold }} />;
  return null;
}

function LiveDemoSection() {
  const [tab, setTab] = useState('portfolio');
  const [prediction, setPrediction] = useState(null);

  return (
    <section style={{ padding: '120px 64px', background: '#090D09' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>LIVE DEMO</SectionLabel>
          <h2 className="fade-up" style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            Try it before you join
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[
            ['portfolio', <TrendingUp key="tu" style={{ width: 16, height: 16 }} />, 'Portfolio'],
            ['leaderboard', <Trophy key="tr" style={{ width: 16, height: 16 }} />, 'Leaderboard'],
            ['predict', <Sparkles key="sp" style={{ width: 16, height: 16 }} />, 'Predict'],
          ].map(([t, icon, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? C.green : 'transparent', color: '#fff',
              border: `1px solid ${tab === t ? C.green : 'rgba(255,255,255,0.2)'}`, borderRadius: 6,
              padding: '9px 20px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 13,
              letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: tab === t ? `0 0 14px ${C.green}44` : 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>{icon}{label}</button>
          ))}
        </div>

        {tab === 'portfolio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ReignCard bg="#111A11" style={{ padding: '28px 32px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>MY PORTFOLIO</div>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0 }}>$10,892</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E87A', boxShadow: '0 0 8px #00E87A' }} />
                <span style={{ fontSize: '1rem', fontWeight: 400, color: '#fff', lineHeight: 1.6 }}>+$892.40 this week · +8.9%</span>
              </div>
            </ReignCard>
            {DEMO_STOCKS.map(s => (
              <ReignCard key={s.sym} accent={s.up ? C.green : C.red} bg="#111A11" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#fff', letterSpacing: '0.02em', lineHeight: 1.3 }}>{s.sym}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#fff' }}>{s.price}</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4, alignItems: 'center' }}>
                    <ChgDisplay chg={s.chg} />
                    <span style={{ fontSize: 13, color: '#fff' }}>{s.amt}</span>
                  </div>
                </div>
              </ReignCard>
            ))}
          </div>
        )}

        {tab === 'leaderboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_LEADERBOARD.map((row, i) => (
              <div key={row.rank} className={`fade-up fade-up-delay-${Math.min(i + 1, 5)}`} style={{
                display: 'flex', alignItems: 'center', padding: '15px 22px', borderRadius: 10,
                ...lbRowStyle(row, i),
              }}>
                <div style={{ width: 40, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {i < 3
                    ? <LbTrophy i={i} />
                    : <span style={{ fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>#{row.rank}</span>
                  }
                </div>
                <div style={{ flex: 1, fontWeight: row.isYou ? 800 : 600, fontSize: 15, color: '#fff' }}>
                  {row.isYou ? '→ YOU' : row.name}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{row.val}</div>
                  <ChgDisplay chg={row.chg} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'predict' && (
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <ReignCard bg="#111A11" style={{ padding: '36px 32px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#E8B84B22', border: '1px solid #E8B84B44',
                borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#fff', marginBottom: 24,
              }}>
                <span className="live-dot" />
                MARKET OPENS IN 23 MIN
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>TODAY'S PREDICTION</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>$AAPL</div>
              <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', margin: '8px 0 28px', lineHeight: 1.6 }}>Apple reports earnings today</div>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#fff', marginBottom: 24, letterSpacing: '0.02em' }}>Up or Down?</div>
              {prediction === null ? (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn-predict-up" onClick={() => setPrediction('up')}>
                    <TrendingUp style={{ width: 18, height: 18 }} /> UP
                  </button>
                  <button className="btn-predict-down" onClick={() => setPrediction('down')}>
                    <TrendingDown style={{ width: 18, height: 18 }} /> DOWN
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{
                    padding: '22px', borderRadius: 10,
                    background: (prediction === 'up' ? C.green : C.red) + '22',
                    border: `2px solid ${prediction === 'up' ? C.green : C.red}`,
                  }}>
                    <Lock style={{ width: 28, height: 28, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 18, color: '#fff' }}>
                      {prediction === 'up'
                        ? <TrendingUp style={{ width: 20, height: 20, color: '#00E87A', filter: 'drop-shadow(0 0 4px #00E87A)' }} />
                        : <TrendingDown style={{ width: 20, height: 20, color: '#B02020' }} />
                      }
                      {prediction === 'up' ? 'UP' : 'DOWN'} — Locked
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Results at market close · 4:00 PM EST</div>
                  </div>
                  <button onClick={() => setPrediction(null)} style={{
                    marginTop: 14, background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)',
                    padding: '6px 16px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 12, cursor: 'pointer',
                  }}>Reset Demo</button>
                </div>
              )}
            </ReignCard>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Section 3: Daily Report Reveal ─── */
const REPORT_LINES = [
  { text: 'Your daily report is ready.', delay: 0, color: 'rgba(255,255,255,0.45)', size: 13, weight: 600, tracking: '0.1em' },
  { text: '━━━━━━━━━━━━━━━━━━', delay: 200, color: 'rgba(255,255,255,0.08)', size: 13, weight: 400 },
  { icon: 'up', text: 'Apple carried your portfolio today', delay: 400, color: '#fff', size: 19, weight: 700 },
  { text: '+2.1%   ·   +$204.80', delay: 650, color: '#fff', size: 32, weight: 800, tracking: '-0.01em', dotColor: '#00E87A' },
  { text: '━━━━━━━━━━━━━━━━━━', delay: 900, color: 'rgba(255,255,255,0.08)', size: 13, weight: 400 },
  { icon: 'down', text: 'Nvidia tore you apart today', delay: 1100, color: '#fff', size: 19, weight: 700 },
  { text: '-3.4%   ·   -$341.20', delay: 1350, color: '#fff', size: 32, weight: 800, tracking: '-0.01em', dotColor: '#B02020' },
  { text: '━━━━━━━━━━━━━━━━━━', delay: 1600, color: 'rgba(255,255,255,0.08)', size: 13, weight: 400 },
  { text: 'Net today:', delay: 1800, color: 'rgba(255,255,255,0.45)', size: 13, weight: 600, tracking: '0.08em' },
  { text: '-$136.40   ·   -1.3%', delay: 2000, color: '#fff', size: 24, weight: 800, tracking: '-0.01em', dotColor: '#B02020' },
  { text: 'You are ranked #4 of 24 students.', delay: 2400, color: 'rgba(255,255,255,0.55)', size: 14, weight: 600 },
];

function DailyReportSection() {
  const [ref, inView] = useInView(0.2);
  return (
    <section style={{ padding: '120px 64px', background: '#080C08' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="fade-up" style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 14 }}>
            Every day ends the same way.
          </h2>
          <p className="fade-up fade-up-delay-1" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1.5 }}>A report that doesn't lie.</p>
        </div>
        <div ref={ref}>
          <ReignCard style={{ padding: '40px 44px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 28, textTransform: 'uppercase' }}>
              DAILY MARKET REPORT  ·  JUNE 5, 2026
            </div>
            {REPORT_LINES.map((line, i) => (
              <div key={i} style={{
                marginBottom: i === 1 || i === 4 || i === 7 ? 16 : 8,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.45s ease ${line.delay}ms, transform 0.45s ease ${line.delay}ms`,
                fontSize: line.size, fontWeight: line.weight, color: line.color,
                letterSpacing: line.tracking ?? 'normal', fontFamily: "'Montserrat', sans-serif",
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                {line.dotColor && <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: line.dotColor, boxShadow: `0 0 6px ${line.dotColor}` }} />}
                {line.icon === 'up' && <TrendingUp style={{ width: 20, height: 20, color: '#00E87A', filter: 'drop-shadow(0 0 4px #00E87A)', flexShrink: 0 }} />}
                {line.icon === 'down' && <TrendingDown style={{ width: 20, height: 20, color: '#B02020', flexShrink: 0 }} />}
                <span>{line.text}</span>
              </div>
            ))}
          </ReignCard>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4: Leaderboard ─── */
const LB_ROWS = [
  { rank: 1, name: 'Jordan K.', period: 'Period 3', val: '$12,847', chg: '+28.5%', streakDays: 12 },
  { rank: 2, name: 'Priya S.', period: 'Period 3', val: '$11,923', chg: '+19.2%', streakDays: 8 },
  { rank: 3, name: 'Marcus T.', period: 'Period 2', val: '$11,445', chg: '+14.5%', streakDays: 5 },
  { rank: 4, name: 'YOU', period: 'Period 3', val: '$10,892', chg: '+8.9%', isYou: true },
  { rank: 5, name: 'Emma R.', period: 'Period 1', val: '$10,234', chg: '+2.3%' },
  { rank: 6, name: 'Liam N.', period: 'Period 2', val: '$9,876', chg: '-1.2%' },
  { rank: 7, name: 'Sofia M.', period: 'Period 1', val: '$9,234', chg: '-6.7%' },
  { rank: 8, name: 'Derek W.', period: 'Period 3', val: '$8,910', chg: '-10.9%' },
];

function LeaderboardSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section style={{
      padding: '120px 64px', background: '#090D09',
      backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(232,184,75,0.08) 0%, transparent 70%)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 740, margin: '0 auto 64px', textAlign: 'center' }}>
          <h2 className="fade-up" style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 14 }}>
            Your entire class.<br />One leaderboard.
          </h2>
          <p className="fade-up fade-up-delay-1" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1.5 }}>Every decision counts.</p>
        </div>

        <div ref={ref} style={{ maxWidth: 740, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LB_ROWS.map((row, i) => (
            <div key={row.rank} className={`fade-up fade-up-delay-${Math.min(i + 1, 5)}`} style={{
              display: 'flex', alignItems: 'center', padding: '16px 24px', borderRadius: 10,
              ...lbRowStyle(row, i),
            }}>
              <div style={{ width: 44, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {i < 3
                  ? <LbTrophy i={i} />
                  : <span style={{ fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.28)' }}>#{row.rank}</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: row.isYou ? 800 : 600, fontSize: '1rem', color: '#fff', lineHeight: 1.6 }}>
                  {row.isYou ? '→ YOU' : row.name}
                </div>
                {row.streakDays && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {i < 2
                      ? <Flame style={{ width: 12, height: 12, color: '#E8B84B' }} />
                      : <Zap style={{ width: 12, height: 12, color: '#E8B84B' }} />
                    }
                    <span>{row.streakDays} day streak</span>
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{row.val}</div>
                <ChgDisplay chg={row.chg} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5: Prediction Mechanic ─── */
function PredictionSection() {
  const [ref, inView] = useInView(0.2);
  const [choice, setChoice] = useState(null);

  return (
    <section style={{ padding: '120px 64px', background: '#080C08' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="two-col">
        <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-28px)', transition: 'all 0.6s ease' }}>
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 className="fade-up" style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3vw, 3rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 24 }}>
            Make your call.<br />Every morning.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 22 }}>
            Every morning you make your call. Every afternoon you find out if you were right.
          </p>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            No guessing. No luck. This is pattern recognition, strategy, and discipline — scored every single day.
          </p>
        </div>

        <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(28px)', transition: 'all 0.6s ease 0.18s' }}>
          <ReignCard style={{ padding: '36px 32px', textAlign: 'center' }} className="pulse-anim">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#E8B84B22', border: '1px solid #E8B84B44',
              borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#fff', marginBottom: 22,
            }}>
              <span className="live-dot" />
              MARKET OPENS IN 23 MIN
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>TODAY'S PREDICTION</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>$AAPL</div>
            <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', margin: '8px 0 28px', lineHeight: 1.6 }}>Apple reports earnings today</div>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#fff', marginBottom: 22, letterSpacing: '0.02em' }}>Up or Down?</div>

            {choice === null ? (
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-predict-up" onClick={() => setChoice('up')}>
                  <TrendingUp style={{ width: 18, height: 18 }} /> UP
                </button>
                <button className="btn-predict-down" onClick={() => setChoice('down')}>
                  <TrendingDown style={{ width: 18, height: 18 }} /> DOWN
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  padding: '20px', borderRadius: 10,
                  background: (choice === 'up' ? C.green : C.red) + '22',
                  border: `2px solid ${choice === 'up' ? C.green : C.red}`,
                }}>
                  <Lock style={{ width: 28, height: 28, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800, fontSize: 18, color: '#fff' }}>
                    {choice === 'up'
                      ? <TrendingUp style={{ width: 20, height: 20, color: '#00E87A', filter: 'drop-shadow(0 0 4px #00E87A)' }} />
                      : <TrendingDown style={{ width: 20, height: 20, color: '#B02020' }} />
                    }
                    {choice === 'up' ? 'UP' : 'DOWN'} — Locked In
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Results at market close · 4:00 PM EST</div>
                </div>
                <button onClick={() => setChoice(null)} style={{
                  marginTop: 12, background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.38)',
                  padding: '6px 16px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 12, cursor: 'pointer',
                }}>Reset Demo</button>
              </div>
            )}
          </ReignCard>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6: Rabbit Hole ─── */
const CHAIN_ICONS = [
  <Zap key="0" style={{ width: 20, height: 20, color: '#E8B84B' }} />,
  <AlertCircle key="1" style={{ width: 20, height: 20, color: '#B02020' }} />,
  <TrendingDown key="2" style={{ width: 20, height: 20, color: '#B02020' }} />,
  <Target key="3" style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.6)' }} />,
  <Sparkles key="4" style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.6)' }} />,
  <TrendingUp key="5" style={{ width: 20, height: 20, color: '#00E87A', filter: 'drop-shadow(0 0 4px #00E87A)' }} />,
  <Crown key="6" style={{ width: 20, height: 20, color: '#E8B84B' }} />,
];

const CHAIN = [
  { level: 0, title: 'Tesla dropped 4.2% today', desc: 'TSLA fell sharply after hours on weak deliveries', color: C.red },
  { level: 1, title: 'EV market sentiment tanks', desc: 'Competitors fall in sympathy — Rivian, Lucid down 3–5%', color: C.red },
  { level: 2, title: 'Battery suppliers get crushed', desc: 'CATL and Panasonic drop 2–3% on volume fears', color: C.red },
  { level: 3, title: 'Investors flee to safety', desc: 'Rotation out of tech into bonds and commodities', color: C.gold },
  { level: 4, title: 'Fed signals concern', desc: 'EV sector slowdown triggers macro worry at the Fed', color: C.gold },
  { level: 5, title: 'Gold hits 6-month high', desc: 'Safe haven buying surges — XAU/USD up 1.4%', color: C.gold },
  { level: 6, title: 'Global markets reprice risk', desc: 'It started with one earnings call.', color: C.green },
];

function RabbitHoleSection() {
  const [ref, inView] = useInView(0.08);
  return (
    <section style={{
      padding: '120px 64px', background: '#090D09',
      backgroundImage: 'radial-gradient(ellipse 50% 60% at 20% 50%, rgba(176,32,32,0.06) 0%, transparent 60%)',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="fade-up" style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 14 }}>
            Every move in the market<br />starts somewhere.
          </h2>
          <p className="fade-up fade-up-delay-1" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1.5 }}>Reign shows you where.</p>
        </div>

        <div ref={ref}>
          {CHAIN.map((item, i) => (
            <div key={i} className={`fade-up fade-up-delay-${Math.min(i + 1, 5)}`} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10, paddingLeft: item.level * 28 }}>
              {item.level > 0 && (
                <div style={{ width: 2, alignSelf: 'stretch', background: `linear-gradient(to bottom, ${CHAIN[i-1].color}44, ${item.color}44)`, marginRight: 12, flexShrink: 0, marginLeft: -14 }} />
              )}
              <ReignCard accent={item.color} bg="#111A11" style={{ flex: 1, padding: '15px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ flexShrink: 0 }}>{CHAIN_ICONS[i]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#fff', letterSpacing: '0.02em', lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginTop: 3, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              </ReignCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 7: Unlock Progression ─── */
const MILESTONES = [
  { day: 'DAY 1', title: 'First Prediction', desc: 'Make your opening move. Lock in your first call and enter the game.', color: C.green },
  { day: 'DAY 10', title: 'Streak Bonus', desc: 'Unlock streak multipliers. Ten days of showing up means ten days of compounding edge.', color: C.gold },
  { day: 'DAY 30', title: 'Portfolio Analyst', desc: 'Your full history unlocks deep performance charts. You can see your own patterns.', color: C.gold },
  { day: 'RANK #1', title: 'Market Sovereign', desc: 'Top of the leaderboard. The crown glows. The class knows your name.', color: '#FFD700' },
];

function UnlockSection() {
  const [ref, inView] = useInView(0.15);
  return (
    <section style={{ padding: '120px 64px', background: '#080C08' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 className="fade-up" style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 14 }}>
            The longer you play,<br />the more you unlock.
          </h2>
          <p className="fade-up fade-up-delay-1" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1.5 }}>
            Every day you show up, the game gets deeper.
          </p>
        </div>

        <div ref={ref}>
          <div style={{ position: 'relative', marginBottom: 52, padding: '0 40px' }}>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: `linear-gradient(to right, ${C.green}, ${C.gold}, #FFD700)`, width: inView ? '100%' : '0%', transition: 'width 2.2s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
            <div style={{ position: 'absolute', top: '50%', left: 40, right: 40, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'space-between' }}>
              {MILESTONES.map((m, i) => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: m.color, boxShadow: `0 0 14px ${m.color}`, border: '2px solid #080C08', opacity: inView ? 1 : 0, transition: `opacity 0.4s ease ${i * 500}ms` }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="four-col">
            {MILESTONES.map((m, i) => (
              <ReignCard key={i} accent={m.color} style={{
                padding: '32px 24px',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.55s ease ${i * 120}ms, transform 0.55s ease ${i * 120}ms`,
              }}>
                <Crown style={{
                  width: 30, height: 30, color: m.color,
                  filter: i === 3 ? `drop-shadow(0 0 10px ${m.color}) drop-shadow(0 0 20px ${m.color}88)` : undefined,
                  marginBottom: 14,
                }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>{m.day}</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.3, marginBottom: 8 }}>{m.title}</div>
                <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{m.desc}</div>
              </ReignCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 8: For Teachers ─── */
function TeachersSection() {
  const [ref, inView] = useInView(0.15);
  const [view, setView] = useState('student');

  const StudentView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="two-col">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase' }}>STUDENT VIEW</div>
        <ReignCard accent={C.green} bg="#162016">
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>My Portfolio</div>
          <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0 }}>$10,892</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E87A', boxShadow: '0 0 6px #00E87A' }} />
            <span style={{ fontSize: '1rem', color: '#fff', lineHeight: 1.6 }}>+8.9% · Rank #4</span>
          </div>
        </ReignCard>
        <ReignCard accent={C.gold} bg="#162016">
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Today's Prediction</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
            <Lock style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.4)' }} />
            AAPL — UP
          </div>
          <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', marginTop: 4, lineHeight: 1.6 }}>Awaiting close</div>
        </ReignCard>
        <ReignCard accent={C.green} bg="#162016">
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Prediction Streak</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, fontWeight: 800, color: '#fff' }}>
            <Flame style={{ width: 22, height: 22, color: '#E8B84B' }} />
            3 days
          </div>
        </ReignCard>
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase' }}>TODAY'S REPORT</div>
        {[
          { icon: <TrendingUp style={{ width: 16, height: 16, color: '#00E87A', filter: 'drop-shadow(0 0 4px #00E87A)' }} />, text: 'AAPL +2.1% — Prediction correct' },
          { icon: <TrendingDown style={{ width: 16, height: 16, color: '#B02020' }} />, text: 'NVDA -3.4% — Prediction missed' },
          { icon: <Target style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.6)' }} />, text: 'Accuracy this week: 60%' },
          { icon: <CheckCircle style={{ width: 16, height: 16, color: '#00E87A' }} />, text: 'Portfolio rank: #4 of 24' },
          { icon: <TrendingUp style={{ width: 16, height: 16, color: '#00E87A', filter: 'drop-shadow(0 0 4px #00E87A)' }} />, text: 'Moved up 2 spots from yesterday' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1rem', color: 'rgba(255,255,255,0.6)', fontWeight: 400, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', lineHeight: 1.6 }}>
            {item.icon}{item.text}
          </div>
        ))}
      </div>
    </div>
  );

  const TeacherView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="two-col">
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase' }}>CLASS OVERVIEW</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Students', val: '24', col: C.green },
            { label: 'Avg Return', val: '+4.2%', col: C.green },
            { label: 'Predictions Today', val: '21/24', col: C.gold },
            { label: 'Class Accuracy', val: '58%', col: C.gold },
          ].map(s => (
            <ReignCard key={s.label} accent={s.col} bg="#162016" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{s.val}</div>
            </ReignCard>
          ))}
        </div>
        <ReignCard accent={C.red} bg="#162016" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>NEEDS ATTENTION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>
            <AlertCircle style={{ width: 16, height: 16, color: '#B02020', flexShrink: 0 }} />
            Derek W. hasn't logged in for 3 days
          </div>
        </ReignCard>
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase' }}>CLASS SETTINGS</div>
        {[
          { on: true, text: 'Starting balance: $10,000' },
          { on: true, text: 'Daily predictions required' },
          { on: true, text: 'Leaderboard visible to all' },
          { on: true, text: 'Reports sent at 4:30 PM' },
          { on: false, text: 'Short selling' },
          { on: false, text: 'Crypto assets' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, background: item.on ? C.green : 'rgba(255,255,255,0.08)', border: `1px solid ${item.on ? C.green : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.on && <CheckCircle style={{ width: 12, height: 12, color: '#00E87A' }} />}
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 400, lineHeight: 1.6, color: item.on ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section style={{ padding: '120px 64px', background: '#090D09' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <SectionLabel color={C.gold}>FOR TEACHERS</SectionLabel>
          <h2 className="fade-up" style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 14 }}>
            Set it up in minutes.
          </h2>
          <p className="fade-up fade-up-delay-1" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1.5 }}>Your students take it from there.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          {[
            ['student', <CheckCircle key="s" style={{ width: 15, height: 15 }} />, 'Student View'],
            ['teacher', <Trophy key="t" style={{ width: 15, height: 15 }} />, 'Teacher Dashboard'],
          ].map(([v, icon, label], i) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? C.green : C.surface, color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)', padding: '10px 26px',
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: '0.04em',
              cursor: 'pointer', borderRadius: i === 0 ? '6px 0 0 6px' : '0 6px 6px 0',
              transition: 'all 0.2s', boxShadow: view === v ? `0 0 14px ${C.green}44` : 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>{icon}{label}</button>
          ))}
        </div>

        <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <ReignCard bg="#111A11" style={{ padding: '36px 40px' }}>
            {view === 'student' ? <StudentView /> : <TeacherView />}
          </ReignCard>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 9: Stats Bar ─── */
function StatsSection() {
  const [ref, inView] = useInView(0.3);
  const s1 = useCounter(2847, inView, 1500);
  const s2 = useCounter(48293, inView, 1500);
  const s3 = useCounter(312, inView, 1500);

  return (
    <section style={{ background: '#0A2A1A', padding: '120px 64px' }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, textAlign: 'center' }} className="stats-grid">
        {[
          { val: s1.toLocaleString(), label: 'Students' },
          { val: s2.toLocaleString(), label: 'Predictions Made' },
          { val: s3.toLocaleString(), label: 'Classes Running' },
        ].map((stat, i) => (
          <div key={i} className={`fade-up fade-up-delay-${i + 1}`}>
            <div style={{
              fontWeight: 800, fontSize: 'clamp(3rem, 6vw, 5rem)',
              color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12,
              textShadow: '0 0 40px rgba(0,232,122,0.3)',
            }}>{stat.val}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Section 10: Final CTA ─── */
function FinalCTASection() {
  const [code, setCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <section style={{
      minHeight: '100vh', background: '#080C08',
      backgroundImage: 'radial-gradient(circle 500px at 50% 40%, rgba(0,232,122,0.1) 0%, transparent 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '80px 64px', textAlign: 'center',
    }}>
      <div className="crown-float" style={{ marginBottom: 28 }}>
        <Crown style={{
          width: 96, height: 96, color: '#E8B84B',
          filter: 'drop-shadow(0 0 16px rgba(232,184,75,0.8)) drop-shadow(0 0 32px rgba(232,184,75,0.4)) drop-shadow(0 0 64px rgba(232,184,75,0.2))',
        }} />
      </div>

      <h2 className="fade-up" style={{ fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.05 }}>Your class is waiting.</h2>

      <p className="fade-up fade-up-delay-1" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', marginBottom: 56, fontWeight: 400, maxWidth: 380, lineHeight: 1.5, letterSpacing: '0.01em' }}>
        Enter your class code to join the market. Every second counts.
      </p>

      {!joined ? (
        <div className="fade-up fade-up-delay-2" style={{ maxWidth: 460, width: '100%' }}>
          <div style={{ display: 'flex', height: 56 }}>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="CLASS CODE"
              maxLength={8}
              onKeyDown={e => e.key === 'Enter' && code.length > 0 && setJoined(true)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${focused ? '#00E87A' : 'rgba(255,255,255,0.12)'}`, borderRight: 'none',
                borderRadius: '8px 0 0 8px', padding: '0 24px',
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: '0.1em',
                color: '#fff', outline: 'none',
                boxShadow: focused ? '0 0 0 3px rgba(0,232,122,0.15)' : 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
            <button
              onClick={() => code.length > 0 && setJoined(true)}
              style={{
                background: code.length > 0 ? '#E8B84B' : 'rgba(232,184,75,0.4)',
                color: '#0D3320', border: 'none', borderRadius: '0 8px 8px 0',
                padding: '0 32px', fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700, fontSize: 16, letterSpacing: '0.06em',
                cursor: code.length > 0 ? 'pointer' : 'default',
                transition: 'background 200ms ease-out, box-shadow 200ms ease-out', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (code.length > 0) { e.target.style.background = '#F0C55A'; e.target.style.boxShadow = '0 0 20px rgba(232,184,75,0.4)'; }}}
              onMouseLeave={e => { e.target.style.background = code.length > 0 ? '#E8B84B' : 'rgba(232,184,75,0.4)'; e.target.style.boxShadow = 'none'; }}
            >JOIN →</button>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat', sans-serif" }}>Your teacher has the code.</div>
        </div>
      ) : (
        <div style={{ padding: '36px 52px', background: '#12A05018', border: `1px solid ${C.green}`, borderRadius: 14, boxShadow: '0 0 48px #00E87A33', maxWidth: 440 }}>
          <CheckCircle style={{ width: 36, height: 36, color: '#00E87A', marginBottom: 14 }} />
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Welcome to the game.</div>
          <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', fontWeight: 400, lineHeight: 1.6 }}>
            Class code <strong style={{ color: '#fff', letterSpacing: '0.1em' }}>{code}</strong> accepted. You're in.
          </div>
        </div>
      )}

      <div style={{ marginTop: 80, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 36, width: '100%', maxWidth: 600 }}>
        <Logo size={18} />
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 20, color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer' }}>PRIVACY POLICY</span>
          <span style={{ cursor: 'pointer' }}>TERMS OF SERVICE</span>
          <span style={{ cursor: 'pointer' }}>CONTACT</span>
        </div>
        <div style={{ marginTop: 16, color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>© 2026 Reign. All rights reserved.</div>
      </div>
    </section>
  );
}

/* ─── Root ─── */
export default function LandingPage() {
  useFadeUpObserver();
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NavBar />
      <Ticker />
      <HeroSection />
      <LiveDemoSection />
      <DailyReportSection />
      <LeaderboardSection />
      <PredictionSection />
      <RabbitHoleSection />
      <UnlockSection />
      <TeachersSection />
      <StatsSection />
      <FinalCTASection />
    </>
  );
}
