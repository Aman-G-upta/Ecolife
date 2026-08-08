import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Trophy,
  Flame,
  ScanLine,
  ArrowRight,
  ClipboardList,
  TrendingUp,
  Sparkles,
} from "lucide-react";

/* ---------------------------------------------------------
   EcoLife AI — Home (public landing page)
   Same "Growth Ring" design language as the Dashboard:
   deep forest palette, Fraunces display serif, tree-ring
   motif as the recurring signature element.
---------------------------------------------------------- */

const COLORS = {
  bg: "#F4F7F1",
  surface: "#FFFFFF",
  ink: "#16241C",
  inkSoft: "#52796F",
  primary: "#1B4332",
  primaryDeep: "#10281D",
  gold: "#D9A544",
  rust: "#C1502E",
  ringTrack: "#E3E9DE",
  border: "#E1E8DC",
};

// Reveals a section once it scrolls into view.
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function RingCluster() {
  // Three concentric rings — illustrative, not live data —
  // representing the three things the app tracks.
  const rings = [
    { r: 92, color: COLORS.primary, pct: 0.78 },
    { r: 70, color: COLORS.gold, pct: 0.55 },
    { r: 48, color: COLORS.rust, pct: 0.36 },
  ];
  return (
    <div className="ring-cluster">
      <svg viewBox="0 0 220 220" width="100%" height="100%">
        {rings.map((ring, i) => {
          const c = 2 * Math.PI * ring.r;
          return (
            <g key={i}>
              <circle
                cx="110"
                cy="110"
                r={ring.r}
                fill="none"
                stroke={COLORS.ringTrack}
                strokeWidth="10"
              />
              <circle
                cx="110"
                cy="110"
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={c}
                transform="rotate(-90 110 110)"
                className="cluster-ring"
                style={{
                  animation: `draw-ring 1.4s cubic-bezier(0.22,1,0.36,1) ${
                    0.2 + i * 0.22
                  }s forwards`,
                  ["--final-offset"]: c - ring.pct * c,
                }}
              />
            </g>
          );
        })}
      </svg>
      <div className="ring-cluster-badge">
        <Sparkles size={14} />
        <span>Level 4</span>
      </div>
    </div>
  );
}

function StepCard({ index, icon, title, copy }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`step-card ${inView ? "in-view" : ""}`}>
      <span className="step-index mono">{index}</span>
      <div className="step-icon">{icon}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-copy">{copy}</p>
    </div>
  );
}

function FeatureCard({ icon, title, copy, tag }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`feature-card ${inView ? "in-view" : ""}`}>
      {tag && <span className="feature-tag">{tag}</span>}
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-copy">{copy}</p>
    </div>
  );
}

const Home = () => {
  return (
    <div className="eco-home" style={{ background: COLORS.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

        .eco-home { font-family: 'Inter', -apple-system, sans-serif; color: ${COLORS.ink}; overflow-x: hidden; }
        .eco-home .display { font-family: 'Fraunces', Georgia, serif; }
        .eco-home .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }

        /* --- nav --- */
        .home-nav {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 24px;
          background: ${COLORS.bg}ee;
          backdrop-filter: blur(6px);
          border-bottom: 1px solid ${COLORS.border};
        }
        .home-nav .wrap { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0; }
        .brand { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 17px; color: ${COLORS.primary}; }
        .nav-actions { display: flex; align-items: center; gap: 10px; }

        .btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-weight: 600; font-size: 14px;
          padding: 10px 20px; border-radius: 999px;
          cursor: pointer; text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          border: 1px solid transparent;
        }
        .btn:focus-visible { outline: 2px solid ${COLORS.primary}; outline-offset: 2px; }
        .btn:active { transform: scale(0.97); }
        .btn-ghost { color: ${COLORS.primary}; border-color: ${COLORS.border}; background: transparent; }
        .btn-ghost:hover { background: ${COLORS.surface}; }
        .btn-primary { color: #fff; background: ${COLORS.primary}; }
        .btn-primary:hover { box-shadow: 0 10px 24px rgba(27,67,50,0.25); transform: translateY(-1px); }
        .btn-lg { padding: 13px 26px; font-size: 15px; }

        /* --- hero --- */
        .hero {
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px;
          align-items: center; padding: 72px 24px 64px;
        }
        @media (max-width: 860px) { .hero { grid-template-columns: 1fr; padding-top: 48px; } }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
          color: ${COLORS.inkSoft}; font-weight: 600; margin-bottom: 14px;
          opacity: 0; animation: rise 0.6s ease 0.05s forwards;
        }
        .hero h1 {
          font-size: clamp(34px, 5vw, 52px); font-weight: 600; line-height: 1.08;
          margin: 0 0 18px 0;
          opacity: 0; animation: rise 0.6s ease 0.15s forwards;
        }
        .hero h1 em { font-style: normal; color: ${COLORS.primary}; }
        .hero p.lede {
          font-size: 17px; color: ${COLORS.inkSoft}; max-width: 480px; line-height: 1.6;
          margin: 0 0 28px 0;
          opacity: 0; animation: rise 0.6s ease 0.25s forwards;
        }
        .hero-ctas {
          display: flex; gap: 12px; flex-wrap: wrap;
          opacity: 0; animation: rise 0.6s ease 0.35s forwards;
        }
        .hero-note {
          margin-top: 16px; font-size: 13px; color: ${COLORS.inkSoft};
          opacity: 0; animation: rise 0.6s ease 0.45s forwards;
        }

        .ring-cluster {
          position: relative; width: min(340px, 80vw); aspect-ratio: 1; margin: 0 auto;
        }
        @keyframes draw-ring { to { stroke-dashoffset: var(--final-offset); } }
        .ring-cluster-badge {
          position: absolute; inset: 0; margin: auto; width: fit-content; height: fit-content;
          display: flex; align-items: center; gap: 6px;
          background: ${COLORS.surface}; border: 1px solid ${COLORS.border};
          padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;
          color: ${COLORS.primary}; box-shadow: 0 8px 20px rgba(27,67,50,0.08);
        }

        /* --- how it works --- */
        .section-head { text-align: center; max-width: 560px; margin: 0 auto 40px; }
        .section-head h2 { font-size: 30px; font-weight: 600; margin: 8px 0 10px; }
        .section-head p { color: ${COLORS.inkSoft}; font-size: 15px; margin: 0; }

        .steps { padding: 88px 24px 24px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 780px) { .steps-grid { grid-template-columns: 1fr; } }

        .step-card {
          background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 18px;
          padding: 26px; position: relative;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .step-card.in-view { opacity: 1; transform: translateY(0); }
        .step-index { position: absolute; top: 22px; right: 24px; font-size: 12px; color: ${COLORS.inkSoft}; }
        .step-icon {
          width: 44px; height: 44px; border-radius: 12px; background: ${COLORS.primary}14;
          color: ${COLORS.primary}; display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .step-title { font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 600; margin: 0 0 8px; }
        .step-copy { font-size: 14px; color: ${COLORS.inkSoft}; line-height: 1.55; margin: 0; }

        /* --- features --- */
        .features { padding: 88px 24px; }
        .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 980px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .features-grid { grid-template-columns: 1fr; } }

        .feature-card {
          background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 18px;
          padding: 22px; position: relative;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .feature-card.in-view { opacity: 1; transform: translateY(0); }
        .feature-card:hover { box-shadow: 0 12px 28px rgba(27,67,50,0.1); border-color: ${COLORS.primary}33; }
        .feature-tag {
          position: absolute; top: 16px; right: 16px;
          font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700;
          color: ${COLORS.gold}; background: ${COLORS.gold}1a; padding: 3px 8px; border-radius: 999px;
        }
        .feature-icon {
          width: 40px; height: 40px; border-radius: 11px; background: ${COLORS.bg};
          border: 1px solid ${COLORS.border};
          display: flex; align-items: center; justify-content: center; color: ${COLORS.primary};
          margin-bottom: 14px;
        }
        .feature-title { font-family: 'Fraunces', Georgia, serif; font-size: 16px; font-weight: 600; margin: 0 0 6px; }
        .feature-copy { font-size: 13.5px; color: ${COLORS.inkSoft}; line-height: 1.5; margin: 0; }

        /* --- cta band --- */
        .cta-band {
          margin: 40px 24px 24px; padding: 56px 40px; border-radius: 24px;
          background: ${COLORS.primary}; color: #fff;
          display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
        }
        .cta-band h2 { font-family: 'Fraunces', Georgia, serif; font-size: 26px; font-weight: 600; margin: 0 0 6px; }
        .cta-band p { margin: 0; opacity: 0.75; font-size: 14px; }
        .cta-band .btn-primary { background: #fff; color: ${COLORS.primary}; }
        .cta-band .btn-primary:hover { box-shadow: 0 10px 24px rgba(0,0,0,0.25); }

        /* --- footer --- */
        .site-footer {
          border-top: 1px solid ${COLORS.border};
          margin-top: 24px;
          padding: 32px 24px;
        }
        .site-footer-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          font-size: 15px;
          color: ${COLORS.primary};
        }
        .footer-links {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .footer-links a {
          font-size: 13px;
          color: ${COLORS.inkSoft};
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer-links a:hover { color: ${COLORS.primary}; }
        .footer-copy {
          font-size: 12.5px;
          color: ${COLORS.inkSoft};
        }
        @media (max-width: 560px) {
          .site-footer-inner { flex-direction: column; align-items: flex-start; gap: 14px; }
        }

        @keyframes rise { to { opacity: 1; transform: translateY(0); } }
        .eyebrow, .hero h1, .hero p.lede, .hero-ctas, .hero-note { transform: translateY(10px); }

        @media (prefers-reduced-motion: reduce) {
          .eyebrow, .hero h1, .hero p.lede, .hero-ctas, .hero-note,
          .cluster-ring, .step-card, .feature-card { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* Nav */}
      <div className="home-nav">
        <div className="wrap">
          <div className="brand">
            <Leaf size={20} />
            EcoLife AI
          </div>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/register" className="btn btn-primary">Get started</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="wrap hero">
        <div>
          <p className="eyebrow"><Sparkles size={13} /> Encourage · Track · Grow</p>
          <h1 className="display">
            Every small habit <em>adds a ring</em> to your impact.
          </h1>
          <p className="lede">
            Log your daily travel, energy, and waste habits. EcoLife AI turns
            them into a green score you can watch grow, level by level —
            with streaks, badges, and a leaderboard to keep you honest.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start your first ring <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">I already have an account</Link>
          </div>
          <p className="hero-note">Free to use · No credit card · Takes under a minute</p>
        </div>
        <RingCluster />
      </div>

      {/* How it works */}
      <div className="wrap steps">
        <div className="section-head">
          <p className="eyebrow" style={{ opacity: 1, animation: "none" }}>How it works</p>
          <h2 className="display">Three steps, one growing ring</h2>
          <p>No spreadsheets. Log what you do, and let your score do the rest.</p>
        </div>
        <div className="steps-grid">
          <StepCard
            index="01"
            icon={<ClipboardList size={20} />}
            title="Log an activity"
            copy="Add a trip, an electricity reading, or (soon) scan an item — takes seconds."
          />
          <StepCard
            index="02"
            icon={<TrendingUp size={20} />}
            title="Watch your score grow"
            copy="Every logged habit adds to your green score and keeps your streak alive."
          />
          <StepCard
            index="03"
            icon={<Trophy size={20} />}
            title="Level up & compete"
            copy="Unlock badges, climb levels, and see how you stack up on the leaderboard."
          />
        </div>
      </div>

      {/* Features */}
      <div className="wrap features">
        <div className="section-head">
          <p className="eyebrow" style={{ opacity: 1, animation: "none" }}>What's inside</p>
          <h2 className="display">Everything you need to build the habit</h2>
        </div>
        <div className="features-grid">
          <FeatureCard
            icon={<TrendingUp size={18} />}
            title="Dashboard"
            copy="A live view of your carbon trend, streak, and green score at a glance."
          />
          <FeatureCard
            icon={<Trophy size={18} />}
            title="Leaderboard"
            copy="See how your green score compares to everyone else building the habit."
          />
          <FeatureCard
            icon={<Flame size={18} />}
            title="Challenges"
            copy="Short, focused challenges that keep your streak — and motivation — alive."
          />
          <FeatureCard
            tag="New"
            icon={<ScanLine size={18} />}
            title="AI Scanner"
            copy="Point your camera at an item and instantly know how to dispose of it."
          />
        </div>
      </div>

      {/* CTA band */}
      <div className="cta-band">
        <div>
          <h2>Ready to start your first ring?</h2>
          <p>It takes less than a minute to create an account.</p>
        </div>
        <Link to="/register" className="btn btn-primary btn-lg">
          Get started <ArrowRight size={16} />
        </Link>
      </div>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <span className="footer-brand">
            <Leaf size={16} /> EcoLife AI
          </span>
          <nav className="footer-links">
            <Link to="/login">Log in</Link>
            <Link to="/register">Get started</Link>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              Back to top
            </a>
          </nav>
          <span className="footer-copy">© 2026 Aman Gupta. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;