import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/* ─── Floating Seed Particle ─── */
function Particle({ style }) {
  return <div style={style} />;
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 20);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Scroll Reveal Wrapper ─── */
function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transforms = {
    up: 'translateY(40px)',
    down: 'translateY(-40px)',
    left: 'translateX(-40px)',
    right: 'translateX(40px)',
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0,0)' : transforms[direction],
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, title, desc, accent, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay} direction="up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? accent + '18' : 'white',
          border: `1.5px solid ${hovered ? accent : '#e8ede6'}`,
          borderRadius: '20px',
          padding: '36px 28px',
          transition: 'all 0.35s cubic-bezier(.22,1,.36,1)',
          transform: hovered ? 'translateY(-8px) scale(1.02)' : 'none',
          boxShadow: hovered ? `0 20px 48px ${accent}28` : '0 2px 12px rgba(0,0,0,0.06)',
          cursor: 'default',
        }}
      >
        <div style={{
          width: 64, height: 64,
          background: accent + '22',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, marginBottom: 20,
          transition: 'transform 0.3s',
          transform: hovered ? 'rotate(-6deg) scale(1.1)' : 'none',
        }}>{icon}</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1c2e0f', margin: '0 0 10px', fontFamily: "'Playfair Display', serif" }}>{title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5a6b51', margin: 0 }}>{desc}</p>
      </div>
    </Reveal>
  );
}

/* ─── Role Card ─── */
function RoleCard({ icon, title, desc, bg, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay} direction="up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? bg : 'white',
          borderRadius: 24,
          padding: '40px 32px',
          textAlign: 'center',
          border: '2px solid #e8ede6',
          transition: 'all 0.4s cubic-bezier(.22,1,.36,1)',
          transform: hovered ? 'translateY(-10px)' : 'none',
          boxShadow: hovered ? '0 24px 56px rgba(74,124,59,0.18)' : '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{
          fontSize: 52, marginBottom: 20,
          transition: 'transform 0.3s',
          transform: hovered ? 'scale(1.2)' : 'none',
          display: 'block',
        }}>{icon}</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1c2e0f', margin: '0 0 12px', fontFamily: "'Playfair Display', serif" }}>{title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5a6b51', margin: 0 }}>{desc}</p>
      </div>
    </Reveal>
  );
}

/* ══════════════════════════════════════
   MAIN HOME COMPONENT
══════════════════════════════════════ */
export default function Home() {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Generate floating particles */
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 6 + (i % 4) * 4,
    x: (i * 37 + 10) % 95,
    y: (i * 53 + 5) % 90,
    duration: 6 + (i % 5) * 2,
    delay: (i * 0.7) % 4,
    emoji: ['🌾', '🌿', '🍃', '✿', '◦'][i % 5],
  }));

  const features = [
    { icon: '🌾', title: t('feature1Title'), desc: t('feature1Desc'), accent: '#4a7c3b' },
    { icon: '🤖', title: t('feature2Title'), desc: t('feature2Desc'), accent: '#f59e0b' },
    { icon: '📍', title: t('feature3Title'), desc: t('feature3Desc'), accent: '#ef4444' },
    { icon: '💳', title: t('feature4Title'), desc: t('feature4Desc'), accent: '#3b82f6' },
    { icon: '💬', title: t('feature5Title'), desc: t('feature5Desc'), accent: '#8b5cf6' },
    { icon: '🌏', title: t('feature6Title'), desc: t('feature6Desc'), accent: '#10b981' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        @keyframes floatUp {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(2%, 2%); }
          30% { transform: translate(-1%, 4%); }
          40% { transform: translate(3%, -1%); }
          50% { transform: translate(-3%, 2%); }
          60% { transform: translate(1%, -2%); }
          70% { transform: translate(-2%, 3%); }
          80% { transform: translate(2%, -3%); }
          90% { transform: translate(-1%, 1%); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        @keyframes leaf-drift {
          0% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
          100% { transform: translateY(0) rotate(-5deg); }
        }

        @keyframes badge-pop {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .hero-cta:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 16px 40px rgba(74,124,59,0.4) !important;
        }
        .hero-cta-ghost:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: translateY(-3px) !important;
        }

        .stat-card:hover {
          transform: translateY(-4px) scale(1.03) !important;
          box-shadow: 0 20px 48px rgba(74,124,59,0.2) !important;
        }

        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .roles-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-h1 { font-size: 44px !important; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-h1 { font-size: 34px !important; }
          .hero-btns { flex-direction: column !important; }
          .hero-btns a { width: 100% !important; text-align: center !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #1a3a0d 0%, #2d5a1b 35%, #4a7c3b 70%, #6b9c5a 100%)',
      }}>
        {/* Grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          animation: 'grain 0.5s steps(1) infinite',
        }} />

        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) translateY(${scrollY * 0.3}px)`,
          width: '900px', height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,195,74,0.18) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Animated leaf shapes */}
        {[
          { top: '8%', left: '6%', size: 140, opacity: 0.12, dur: 7 },
          { top: '60%', left: '3%', size: 80, opacity: 0.08, dur: 9 },
          { top: '15%', right: '8%', size: 180, opacity: 0.1, dur: 8 },
          { bottom: '12%', right: '5%', size: 100, opacity: 0.09, dur: 6 },
          { bottom: '5%', left: '20%', size: 60, opacity: 0.07, dur: 10 },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', ...s,
            width: s.size, height: s.size,
            borderRadius: '60% 40% 70% 30% / 40% 60% 30% 70%',
            background: 'rgba(139,195,74,0.6)',
            opacity: s.opacity,
            animation: `leaf-drift ${s.dur}s ease-in-out infinite`,
            animationDelay: `${i * 1.3}s`,
            pointerEvents: 'none', zIndex: 1,
          }} />
        ))}

        {/* Floating emoji particles */}
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            fontSize: p.size,
            opacity: 0.25,
            animation: `floatUp ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            pointerEvents: 'none', zIndex: 2,
            filter: 'blur(0.5px)',
          }}>{p.emoji}</div>
        ))}

        {/* Parallax circle accent */}
        <div style={{
          position: 'absolute', top: '20%', right: '12%',
          width: 320, height: 320,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
          transform: `translateY(${scrollY * 0.15}px)`,
          zIndex: 2, pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', inset: 24,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              position: 'absolute', inset: 24,
              borderRadius: '50%',
              border: '1px dashed rgba(255,255,255,0.1)',
            }} />
          </div>
        </div>

        {/* Hero Content */}
        <div style={{
          position: 'relative', zIndex: 10, textAlign: 'center',
          padding: '0 24px', maxWidth: 820, width: '100%',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 40, padding: '8px 20px',
            marginBottom: 32, color: '#c8e6a0',
            fontSize: 13, fontWeight: 500, letterSpacing: '0.06em',
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(.22,1,.36,1) 0.1s',
            animation: heroLoaded ? 'badge-pop 0.6s cubic-bezier(.22,1,.36,1) 0.2s both' : 'none',
          }}>
            <span style={{ fontSize: 16 }}>🌱</span>
            {t('heroBadge')}
          </div>

          <h1 className="hero-h1" style={{
            fontSize: '62px',
            fontWeight: 900, lineHeight: 1.1,
            color: 'white', margin: '0 0 24px',
            fontFamily: "'Playfair Display', serif",
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s cubic-bezier(.22,1,.36,1) 0.25s',
          }}>
            {t('heroTitlePart1')}{' '}
            <span style={{
              background: 'linear-gradient(90deg, #c8e6a0, #8bc34a, #c8e6a0)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite',
              fontStyle: 'italic',
            }}>{t('heroTitleHighlight')}</span>
            {' '}{t('heroTitlePart2')}
          </h1>

          <p style={{
            fontSize: 18, lineHeight: 1.8, color: 'rgba(255,255,255,0.82)',
            maxWidth: 600, margin: '0 auto 44px', fontWeight: 300,
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(.22,1,.36,1) 0.4s',
          }}>
            {t('heroSubtitle')}
          </p>

          <div className="hero-btns" style={{
            display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center',
            flexWrap: 'wrap',
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(.22,1,.36,1) 0.55s',
          }}>
            <Link to="/market" className="hero-cta" style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #8bc34a 0%, #558b2f 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 50, fontSize: 16, fontWeight: 600,
              transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
              boxShadow: '0 8px 24px rgba(74,124,59,0.4)',
              letterSpacing: '0.02em',
            }}>
              🛒 {t('exploreMarketplace')}
            </Link>
            <a href="#about" className="hero-cta-ghost" style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'rgba(255,255,255,0.08)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 50, fontSize: 16, fontWeight: 500,
              border: '1.5px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s',
              backdropFilter: 'blur(8px)',
            }}>
              {t('learnMore')} ↓
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: heroLoaded ? 0.6 : 0,
          transition: 'opacity 1s ease 1.2s',
          animation: heroLoaded ? 'floatUp 2.5s ease-in-out infinite' : 'none',
        }}>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.4)' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: '0.12em' }}>
            {t('scrollHint')}
          </span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: '#f4f7f2', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative large text */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 200, fontWeight: 900, color: 'rgba(74,124,59,0.04)',
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1,
        }}>KRISHI</div>

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal direction="up">
            <div style={{
              display: 'inline-block',
              background: '#e8f5e9', color: '#2d5a1b',
              borderRadius: 40, padding: '6px 18px',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.1em',
              marginBottom: 24, textTransform: 'uppercase',
            }}>{t('aboutLabel')}</div>
          </Reveal>

          <Reveal delay={100} direction="up">
            <h2 style={{
              fontSize: 48, fontWeight: 900,
              color: '#1c2e0f',
              margin: '0 0 32px',
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.2,
            }}>
              {t('aboutTitle1')}{' '}
              <span style={{ color: '#4a7c3b', fontStyle: 'italic' }}>{t('aboutTitleHighlight')}</span>{' '}
              {t('aboutTitle2')}
            </h2>
          </Reveal>

          <Reveal delay={200} direction="up">
            <p style={{
              fontSize: 17, lineHeight: 1.9, color: '#5a6b51',
              margin: 0,
            }}>
              {t('aboutDesc')}
            </p>
          </Reveal>

          <Reveal delay={300} direction="up">
            <div style={{
              marginTop: 48,
              display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
            }}>
              {[
                t('tagVerified'),
                t('tagRealtime'),
                t('tagBilingual'),
                t('tagFairTrade'),
              ].map((tag, i) => (
                <span key={i} style={{
                  background: 'white', border: '1.5px solid #c8dfc0',
                  borderRadius: 40, padding: '8px 20px',
                  fontSize: 13, color: '#2d5a1b', fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(74,124,59,0.08)',
                }}>{tag}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: 'white', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal direction="up">
            <div style={{ textAlign: 'center', marginBottom: 72 }}>
              <div style={{
                display: 'inline-block',
                background: '#e8f5e9', color: '#2d5a1b',
                borderRadius: 40, padding: '6px 18px',
                fontSize: 12, fontWeight: 600, letterSpacing: '0.1em',
                marginBottom: 20, textTransform: 'uppercase',
              }}>{t('featuresLabel')}</div>
              <h2 style={{
                fontSize: 48, fontWeight: 900, color: '#1c2e0f',
                margin: 0, fontFamily: "'Playfair Display', serif",
              }}>
                {t('featuresTitle1')}{' '}
                <span style={{ color: '#4a7c3b', fontStyle: 'italic' }}>{t('featuresTitleHighlight')}</span>
              </h2>
            </div>
          </Reveal>

          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
          }}>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section style={{ background: 'linear-gradient(180deg, #f4f7f2 0%, #e8f0e4 100%)', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal direction="up">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{
                display: 'inline-block',
                background: '#e8f5e9', color: '#2d5a1b',
                borderRadius: 40, padding: '6px 18px',
                fontSize: 12, fontWeight: 600, letterSpacing: '0.1em',
                marginBottom: 20, textTransform: 'uppercase',
              }}>{t('rolesLabel')}</div>
              <h2 style={{
                fontSize: 48, fontWeight: 900, color: '#1c2e0f',
                margin: '0 0 16px', fontFamily: "'Playfair Display', serif",
              }}>
                {t('rolesTitle1')}{' '}
                <span style={{ color: '#4a7c3b', fontStyle: 'italic' }}>{t('rolesTitleHighlight')}</span>
              </h2>
              <p style={{ fontSize: 16, color: '#7a8c6e', margin: 0 }}>
                {t('rolesSubtitle')}
              </p>
            </div>
          </Reveal>

          <div className="roles-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28, marginBottom: 48,
          }}>
            <RoleCard icon="🚜" title={t('role1Title')} bg="#e8f5e9"
              desc={t('role1Desc')}
              delay={0} />
            <RoleCard icon="🛒" title={t('role2Title')} bg="#e3f2fd"
              desc={t('role2Desc')}
              delay={100} />
            <RoleCard icon="⚙️" title={t('role3Title')} bg="#fff8e1"
              desc={t('role3Desc')}
              delay={200} />
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a3a0d 0%, #2d5a1b 50%, #3d7a28 100%)',
        padding: '100px 24px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,195,74,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <Reveal direction="up">
            <div style={{ fontSize: 56, marginBottom: 20 }}>🌾</div>
            <h2 style={{
              fontSize: 48, fontWeight: 900, color: 'white',
              margin: '0 0 20px', fontFamily: "'Playfair Display', serif",
            }}>
              {t('ctaTitle1')}{' '}
              <span style={{ color: '#8bc34a', fontStyle: 'italic' }}>{t('ctaTitleHighlight')}</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', margin: '0 0 44px', lineHeight: 1.8 }}>
              {t('ctaSubtitle')}
            </p>
            <Link to="/market" style={{
              display: 'inline-block',
              padding: '18px 52px',
              background: 'linear-gradient(135deg, #8bc34a 0%, #558b2f 100%)',
              color: 'white', textDecoration: 'none',
              borderRadius: 50, fontSize: 17, fontWeight: 700,
              boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
              transition: 'all 0.3s',
              letterSpacing: '0.02em',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.3)'; }}
            >
              {t('ctaBtn')}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0d1f07', padding: '72px 24px 36px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 48, marginBottom: 56,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>🌾</span>
                <span style={{
                  fontSize: 20, fontWeight: 900,
                  fontFamily: "'Playfair Display', serif",
                  color: '#8bc34a',
                }}>{t('appName')}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                {t('footerTagline')}
              </p>
            </div>

            {[
              {
                title: t('footerProduct'),
                links: [t('footerFarmerPortal'), t('footerBuyerPortal'), t('footerAdminPanel'), t('footerMarketplace')],
              },
              {
                title: t('footerLegal'),
                links: [t('footerPrivacy'), t('footerRefund'), t('footerPricing'), t('footerFAQ')],
              },
              {
                title: t('footerCommunity'),
                links: [t('footerStories'), t('footerGallery'), t('footerBlog'), t('footerContact')],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{
                  fontSize: 13, fontWeight: 700, color: '#8bc34a',
                  margin: '0 0 20px', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.links.map((l, j) => (
                    <li key={j} style={{ marginBottom: 10 }}>
                      <a href="#" style={{
                        fontSize: 14, color: 'rgba(255,255,255,0.55)',
                        textDecoration: 'none', transition: 'color 0.2s',
                      }}
                      onMouseOver={e => e.currentTarget.style.color = '#c8e6a0'}
                      onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                      >{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 16,
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              {t('footerCopyright')}
            </span>
            <div style={{ display: 'flex', gap: 20 }}>
              {['🐦', '📘', '📸'].map((ico, i) => (
                <span key={i} style={{
                  fontSize: 18, cursor: 'pointer', opacity: 0.5,
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '1'}
                onMouseOut={e => e.currentTarget.style.opacity = '0.5'}
                >{ico}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
