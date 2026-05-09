import { useState, useEffect, useRef, useCallback } from 'react'

// ── Target: 11 Haziran 2026 00:00 UTC ──
const TARGET = new Date('2026-06-11T00:00:00.000Z')

// ── Telegram WebApp init ──
function initTelegram() {
  try {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      return tg
    }
  } catch (_) {}
  return null
}

// ── Time calculation ──
function getTimeLeft() {
  const now = Date.now()
  const diff = TARGET.getTime() - now
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

// ── Decorative Stars ──
const STARS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2.5 + 1,
  dur: `${Math.random() * 3 + 2}s`,
  delay: `${Math.random() * 4}s`,
  opacity: Math.random() * 0.5 + 0.1,
}))

// ── Light rays (stadium spotlights) ──
const RAYS = [
  { left: '10%', rotate: '-15deg', opacity: 0.6 },
  { left: '25%', rotate: '-5deg', opacity: 0.4 },
  { left: '75%', rotate: '5deg', opacity: 0.4 },
  { left: '90%', rotate: '15deg', opacity: 0.6 },
]

// ── CountdownCard ──
function CountdownCard({ value, label, prevValue }) {
  const isNew = value !== prevValue
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="glass-card-gold rounded-xl w-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{ paddingTop: '12px', paddingBottom: '12px', minHeight: '88px' }}>
        {/* Inner shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.6), transparent)' }} />

        {/* Corner accents */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-yellow-400/40 rounded-tl" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-yellow-400/40 rounded-tr" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-yellow-400/40 rounded-bl" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-yellow-400/40 rounded-br" />

        <span
          key={value}
          className={`font-display number-glow text-yellow-400 leading-none select-none ${isNew ? 'number-flip' : ''}`}
          style={{ fontSize: 'clamp(38px, 10vw, 56px)', fontWeight: 700, letterSpacing: '-1px' }}
        >
          {pad(value)}
        </span>
      </div>
      <span className="font-body text-yellow-200/60 uppercase tracking-widest select-none"
        style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
        {label}
      </span>
    </div>
  )
}

// ── Separator ──
function Sep() {
  return (
    <div className="flex flex-col items-center justify-center pb-6 gap-1.5">
      <span className="text-yellow-400/60 font-display" style={{ fontSize: '28px', lineHeight: 1, animation: 'pulseDot 1s ease-in-out infinite' }}>:</span>
    </div>
  )
}

// ── Trophy SVG (abstract, non-branded) ──
function TrophyIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Cup body */}
      <path d="M15 6h18v16c0 6-4 10-9 11-5-1-9-5-9-11V6z" fill="url(#tg)" opacity="0.9" />
      {/* Handles */}
      <path d="M15 9H9a5 5 0 005 5h1M33 9h6a5 5 0 01-5 5h-1" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      {/* Stem */}
      <rect x="21" y="33" width="6" height="5" rx="1" fill="url(#tg)" opacity="0.8" />
      {/* Base */}
      <rect x="16" y="38" width="16" height="3" rx="1.5" fill="url(#tg)" />
      {/* Stars */}
      <circle cx="24" cy="16" r="2.5" fill="#fff" opacity="0.7" />
      <circle cx="20" cy="13" r="1.2" fill="#fff" opacity="0.4" />
      <circle cx="28" cy="13" r="1.2" fill="#fff" opacity="0.4" />
    </svg>
  )
}

// ── Football texture dots ──
function FootballBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Pentagon-like dots suggesting football texture */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-white/[0.03]"
          style={{
            width: `${80 + i * 40}px`,
            height: `${80 + i * 40}px`,
            top: `${10 + i * 8}%`,
            left: `${50 + (i % 2 === 0 ? -20 : 20)}%`,
            transform: 'translate(-50%, -50%) rotate(45deg)',
            animation: `spin ${20 + i * 5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }}
        />
      ))}
    </div>
  )
}

// ── Confetti (celebration) ──
const CONFETTI_COLORS = ['#fbbf24', '#ef4444', '#3b82f6', '#22c55e', '#fff', '#f472b6']
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      {Array.from({ length: 40 }).map((_, i) => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
        const left = `${Math.random() * 100}%`
        const size = Math.random() * 8 + 4
        const dur = Math.random() * 3 + 2
        const delay = Math.random() * 2
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '-10px',
              left,
              width: size,
              height: size,
              background: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animation: `fall ${dur}s ${delay}s ease-in infinite`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        )
      })}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ── Main App ──
export default function App() {
  const [time, setTime] = useState(null)
  const [prevTime, setPrevTime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [finished, setFinished] = useState(false)

  const intervalRef = useRef(null)

  const tick = useCallback(() => {
    try {
      const t = getTimeLeft()
      if (!t) {
        setFinished(true)
        setTime(null)
        if (intervalRef.current) clearInterval(intervalRef.current)
      } else {
        setPrevTime(prev => prev)
        setTime(prev => {
          setPrevTime(prev)
          return t
        })
      }
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => {
    try {
      initTelegram()
    } catch (_) {}

    // Initial calculation
    const initial = getTimeLeft()
    if (!initial) {
      setFinished(true)
    } else {
      setTime(initial)
    }
    setLoading(false)

    intervalRef.current = setInterval(tick, 1000)
    return () => clearInterval(intervalRef.current)
  }, [tick])

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-dvh pitch-bg stadium-glow flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-yellow-400/30 border-t-yellow-400 animate-spin" />
          <span className="font-body text-yellow-200/50 tracking-widest uppercase text-sm">Yükleniyor...</span>
        </div>
      </div>
    )
  }

  // ── Error fallback ──
  if (error) {
    return (
      <div className="min-h-dvh pitch-bg flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-8 text-center max-w-sm">
          <p className="font-display text-yellow-400 text-xl mb-2">Bağlantı Hatası</p>
          <p className="font-body text-white/50 text-sm">Lütfen sayfayı yenileyin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh pitch-bg stadium-glow relative overflow-hidden page-enter">
      {/* Background decorations */}
      <FootballBg />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {STARS.map(s => (
          <div
            key={s.id}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              '--dur': s.dur,
              '--delay': s.delay,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Stadium light rays */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {RAYS.map((r, i) => (
          <div
            key={i}
            className="light-ray"
            style={{
              left: r.left,
              transform: `rotate(${r.rotate})`,
              opacity: r.opacity,
            }}
          />
        ))}
      </div>

      {/* Celebration confetti */}
      {finished && <Confetti />}

      {/* ══ Content ══ */}
      <div className="relative z-10 flex flex-col min-h-dvh mx-auto w-full"
        style={{ maxWidth: '480px' }}>

        {/* ── HEADER: Logo ── */}
        <header className="flex items-center justify-center px-6 pt-8 pb-4 page-enter stagger-1">
          <div className="glass-card rounded-2xl px-6 py-3 logo-glow">
            <img
              src="./assets/pusula-logo.png"
              alt="Pusulabet"
              className="h-10 w-auto object-contain select-none"
              style={{ maxWidth: '200px' }}
              draggable={false}
            />
          </div>
        </header>

        {/* ── HERO: Title area ── */}
        <section className="flex flex-col items-center px-6 pt-4 pb-2 page-enter stagger-2">
          {/* Trophy + title */}
          <div className="flex items-center gap-3 mb-3">
            <div style={{ animation: 'ringPulse 2.5s ease-in-out infinite', display: 'inline-flex' }}>
              <TrophyIcon size={40} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-display shimmer-text leading-tight select-none"
                style={{ fontSize: 'clamp(22px, 6vw, 32px)', fontWeight: 700, letterSpacing: '0.05em' }}>
                2026 DÜNYA KUPASI
              </h1>
              <div className="gold-divider mt-1" />
            </div>
            <div style={{ animation: 'ringPulse 2.5s ease-in-out infinite 0.5s', display: 'inline-flex' }}>
              <TrophyIcon size={40} />
            </div>
          </div>

          {/* Subtitle */}
          <p className="font-body text-white/50 tracking-[0.15em] uppercase text-center select-none"
            style={{ fontSize: '12px' }}>
            {finished
              ? 'Turnuva başladı!'
              : 'Turnuvanın başlamasına kalan süre'}
          </p>

          {/* Date badge */}
          {!finished && (
            <div className="mt-3 glass-card rounded-full px-4 py-1.5 flex items-center gap-2">
              <span className="text-yellow-400/60" style={{ fontSize: '10px' }}>📅</span>
              <span className="font-mono text-yellow-200/50" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                11 HAZİRAN 2026 · 00:00 UTC
              </span>
            </div>
          )}
        </section>

        {/* ── MAIN: Countdown or Celebration ── */}
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-4 page-enter stagger-3">
          {!finished && time ? (
            <>
              {/* Glow ring behind cards */}
              <div className="absolute pointer-events-none"
                style={{
                  width: '300px', height: '300px',
                  background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}>
              </div>

              {/* Cards row */}
              <div className="w-full flex items-end gap-2 mb-2">
                <CountdownCard value={time.days} label="Gün" prevValue={prevTime?.days} />
                <Sep />
                <CountdownCard value={time.hours} label="Saat" prevValue={prevTime?.hours} />
                <Sep />
                <CountdownCard value={time.minutes} label="Dakika" prevValue={prevTime?.minutes} />
                <Sep />
                <CountdownCard value={time.seconds} label="Saniye" prevValue={prevTime?.seconds} />
              </div>

              {/* Total days label */}
              <p className="font-body text-white/20 text-xs tracking-widest uppercase mt-2 text-center">
                {time.days} günlük efsane bekleniyor
              </p>
            </>
          ) : finished ? (
            /* ── Celebration state ── */
            <div className="flex flex-col items-center gap-6 text-center px-4">
              <div className="celebrate">
                <TrophyIcon size={96} />
              </div>
              <div>
                <h2 className="font-display shimmer-text leading-tight"
                  style={{ fontSize: 'clamp(28px, 8vw, 48px)', fontWeight: 700 }}>
                  DÜNYA KUPASI
                </h2>
                <h2 className="font-display text-white leading-tight"
                  style={{ fontSize: 'clamp(28px, 8vw, 48px)', fontWeight: 700 }}>
                  BAŞLADI!
                </h2>
              </div>
              <div className="glass-card-gold rounded-2xl px-6 py-4">
                <p className="font-body text-yellow-200 tracking-wide" style={{ fontSize: '15px' }}>
                  🏆 Tüm maçları Pusulabet ile takip et!
                </p>
              </div>
            </div>
          ) : null}
        </main>

        {/* ── LIVE INDICATOR ── */}
        <section className="flex justify-center px-6 pb-3 page-enter stagger-4">
          {!finished && (
            <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2.5">
              <span
                className="pulse-dot inline-block w-2 h-2 rounded-full bg-green-400"
              />
              <span className="font-body text-white/50 uppercase tracking-widest"
                style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                Canlı Geri Sayım
              </span>
            </div>
          )}
        </section>

        {/* ── LOCATION BADGES ── */}
        <section className="flex justify-center gap-2 px-6 pb-3 flex-wrap page-enter stagger-5">
          {['🇺🇸 ABD', '🇨🇦 Kanada', '🇲🇽 Meksika'].map(flag => (
            <div key={flag} className="glass-card rounded-full px-3 py-1">
              <span className="font-body text-white/30" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                {flag}
              </span>
            </div>
          ))}
        </section>

        {/* ── FOOTER ── */}
        <footer className="px-6 pb-8 pt-3 page-enter stagger-6">
          <div className="gold-divider mb-4" />
          <p className="font-body text-center text-white/30 tracking-wide select-none"
            style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
            🏆 <span className="text-yellow-400/60">Pusulabet</span> ile Dünya Kupası heyecanı başlıyor
          </p>
          <p className="font-body text-center text-white/15 mt-1"
            style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
            pusulabet.com · 18+
          </p>
        </footer>
      </div>
    </div>
  )
}
