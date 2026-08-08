import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Leaf, Activity, Flame, RefreshCw, Sparkles } from "lucide-react";
import API from "../services/api";
import Navbar from "../components/Navbar";

/* ---------------------------------------------------------
   EcoLife AI — Dashboard
   Design language: "Growth Ring" — greenScore is reframed as
   a level system (100 pts per level) and visualized as a
   tree-ring style progress ring, echoing the eco theme
   instead of a generic stat/donut widget.
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

// ---- demo fallback so this preview always renders something ----
// In your real app, remove this once the backend is reliably reachable —
// or keep it as a graceful "offline demo mode" fallback for your hackathon
// live demo in case the API hiccups on stage.
function buildMockDashboard() {
  const today = new Date();
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString(),
      carbon: Math.round((Math.random() * 4 + 1) * 10) / 10,
    };
  });
  return {
    totalActivities: 23,
    totalCarbon: weeklyData.reduce((s, d) => s + d.carbon, 0),
    weeklyData,
    greenScore: 340,
    streak: 6,
  };
}

// Aggregate raw activity-level entries into one point per day,
// and fill in any missing days so the chart always shows a full week.
function toWeeklySeries(weeklyData) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const totals = new Map();
  weeklyData.forEach((entry) => {
    const key = new Date(entry.date).toDateString();
    totals.set(key, (totals.get(key) || 0) + entry.carbon);
  });
  return days.map((d) => ({
    label: d.toLocaleDateString(undefined, { weekday: "short" }),
    carbon: Math.round((totals.get(d.toDateString()) || 0) * 10) / 10,
  }));
}

function GrowthRing({ greenScore }) {
  const level = Math.floor(greenScore / 100) + 1;
  const progress = greenScore % 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="growth-ring">
      <svg viewBox="0 0 140 140" width="140" height="140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={COLORS.ringTrack}
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          className="ring-progress"
        />
      </svg>
      <div className="ring-center">
        <span className="ring-level">Lv {level}</span>
        <span className="ring-score">{greenScore}</span>
        <span className="ring-caption">green score</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, delay }) {
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-icon" style={{ background: accent + "1a", color: accent }}>
        {icon}
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-day">{label}</p>
      <p className="chart-tooltip-value">{payload[0].value} kg CO₂</p>
    </div>
  );
}

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.get("/dashboard");
      setData(res.data.data);
      setUsingDemoData(false);
    } catch (err) {
      console.error(err);
      setData(buildMockDashboard());
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const series = useMemo(
    () => (data ? toWeeklySeries(data.weeklyData) : []),
    [data]
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

        .eco-dash { font-family: 'Inter', -apple-system, sans-serif; color: ${COLORS.ink}; }
        .eco-dash .display { font-family: 'Fraunces', Georgia, serif; }
        .eco-dash .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .eyebrow {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${COLORS.inkSoft};
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .hero-row {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: center;
          justify-content: space-between;
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 20px;
          padding: 28px 32px;
        }
        .hero-content {
          display: flex;
          align-items: center;
          gap: 24px;
          min-width: 0;
        }
        .hero-headline {
          font-size: clamp(18px, 5vw, 26px);
          margin: 0;
          font-weight: 600;
          line-height: 1.25;
        }
        @media (max-width: 560px) {
          .hero-row { padding: 22px 20px; }
          .hero-content { flex-direction: column; align-items: flex-start; gap: 16px; }
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid ${COLORS.border};
          color: ${COLORS.primary};
          font-size: 13px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .refresh-btn:hover { background: ${COLORS.bg}; }
        .refresh-btn:active { transform: scale(0.97); }
        .refresh-btn:focus-visible {
          outline: 2px solid ${COLORS.primary};
          outline-offset: 2px;
        }
        .refresh-btn.spinning svg { animation: spin 0.7s linear infinite; }

        .growth-ring { position: relative; width: 140px; height: 140px; flex-shrink: 0; }
        .ring-progress {
          transition: stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ring-level {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 13px;
          color: ${COLORS.inkSoft};
          font-weight: 500;
        }
        .ring-score {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 30px;
          font-weight: 600;
          color: ${COLORS.primary};
          line-height: 1.1;
        }
        .ring-caption {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${COLORS.inkSoft};
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 24px;
        }
        @media (max-width: 720px) {
          .stats-grid { grid-template-columns: 1fr; }
        }

        .stat-card {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          opacity: 0;
          transform: translateY(8px);
          animation: rise 0.5s ease forwards;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .stat-card:hover {
          box-shadow: 0 8px 24px rgba(27, 67, 50, 0.08);
          transform: translateY(-2px);
        }
        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-label {
          margin: 0 0 2px 0;
          font-size: 12px;
          color: ${COLORS.inkSoft};
          font-weight: 500;
        }
        .stat-value {
          margin: 0;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: ${COLORS.ink};
        }

        .chart-card {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 20px;
          padding: 24px 24px 12px 8px;
          margin-top: 24px;
        }
        .chart-card-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 0 16px 12px 24px;
        }
        .chart-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        .chart-tooltip {
          background: ${COLORS.primaryDeep};
          color: #fff;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12px;
        }
        .chart-tooltip-day { margin: 0 0 2px 0; opacity: 0.7; }
        .chart-tooltip-value { margin: 0; font-weight: 600; }

        .demo-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${COLORS.gold}22;
          color: #8a6416;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .skeleton {
          background: linear-gradient(90deg, ${COLORS.border} 25%, #eef2ea 37%, ${COLORS.border} 63%);
          background-size: 400% 100%;
          border-radius: 14px;
          animation: shimmer 1.4s ease infinite;
        }

        @keyframes rise {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .stat-card, .ring-progress, .refresh-btn.spinning svg { animation: none !important; transition: none !important; }
        }
      `}</style>

      <Navbar />

      <div className="eco-dash" style={{ padding: "24px", maxWidth: 1080, margin: "0 auto" }}>
        {usingDemoData && !loading && (
          <div className="demo-banner">
            <Sparkles size={16} />
            Showing sample data — couldn't reach the live API.
          </div>
        )}

        {loading || !data ? (
          <div>
            <div className="skeleton" style={{ height: 148, marginBottom: 24 }} />
            <div className="stats-grid">
              <div className="skeleton" style={{ height: 84 }} />
              <div className="skeleton" style={{ height: 84 }} />
              <div className="skeleton" style={{ height: 84 }} />
            </div>
            <div className="skeleton" style={{ height: 280, marginTop: 24 }} />
          </div>
        ) : (
          <>
            <div className="hero-row">
              <div className="hero-content">
                <GrowthRing greenScore={data.greenScore} />
                <div>
                  <p className="eyebrow">Your impact, growing</p>
                  <h1 className="display hero-headline">
                    {data.streak > 0
                      ? `${data.streak}-day streak — keep it going`
                      : "Log an activity to start your streak"}
                  </h1>
                  <p style={{ margin: "6px 0 0 0", color: COLORS.inkSoft, fontSize: 14 }}>
                    {100 - (data.greenScore % 100)} points to level {Math.floor(data.greenScore / 100) + 2}
                  </p>
                </div>
              </div>
              <button
                className={`refresh-btn ${loading ? "spinning" : ""}`}
                onClick={fetchDashboard}
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            <div className="stats-grid">
              <StatCard
                icon={<Leaf size={20} />}
                label="Total carbon logged"
                value={`${data.totalCarbon.toFixed(1)} kg`}
                accent={COLORS.primary}
                delay={0}
              />
              <StatCard
                icon={<Activity size={20} />}
                label="Activities logged"
                value={data.totalActivities}
                accent={COLORS.gold}
                delay={80}
              />
              <StatCard
                icon={<Flame size={20} />}
                label="Current streak"
                value={`${data.streak} days`}
                accent={COLORS.rust}
                delay={160}
              />
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <h2 className="chart-title">Weekly carbon usage</h2>
                <span className="mono" style={{ fontSize: 12, color: COLORS.inkSoft }}>
                  last 7 days
                </span>
              </div>
              {series.every((d) => d.carbon === 0) ? (
                <div style={{ padding: "40px 24px", textAlign: "center", color: COLORS.inkSoft }}>
                  No activity yet this week — log one to see your trend here.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={series} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="carbonFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={COLORS.border} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: COLORS.inkSoft, fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: COLORS.inkSoft, fontSize: 12 }}
                      width={32}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="carbon"
                      stroke={COLORS.primary}
                      strokeWidth={2.5}
                      fill="url(#carbonFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;