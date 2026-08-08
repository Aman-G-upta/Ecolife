import React, { useEffect, useState } from "react";
import { Trophy, Flame, Medal } from "lucide-react";
import API from "../services/api";
import Navbar from "../components/Navbar";



const COLORS = {
  bg: "#F4F7F1",
  surface: "#FFFFFF",
  ink: "#16241C",
  inkSoft: "#52796F",
  primary: "#1B4332",
  primaryDeep: "#10281D",
  gold: "#D9A544",
  silver: "#A8B0A6",
  bronze: "#C1502E",
  border: "#E1E8DC",
};

const medalColor = (rank) => {
  if (rank === 1) return COLORS.gold;
  if (rank === 2) return COLORS.silver;
  if (rank === 3) return COLORS.bronze;
  return null;
};

function Avatar({ name }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  return <div className="lb-avatar">{initial}</div>;
}

function LeaderRow({ user, rank, highlight }) {
  const medal = medalColor(rank);
  return (
    <div className={`lb-row ${highlight ? "highlight" : ""}`}>
      <div className="lb-rank">
        {medal ? <Medal size={18} color={medal} /> : <span className="mono">#{rank}</span>}
      </div>
      <Avatar name={user.name} />
      <div className="lb-name">
        <p>{user.name}</p>
        {user.streak > 0 && (
          <span className="lb-streak">
            <Flame size={12} /> {user.streak}d streak
          </span>
        )}
      </div>
      <div className="lb-score mono">{user.greenScore}</div>
    </div>
  );
}

const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/leaderboard");
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="eco-lb">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

        .eco-lb { min-height: 100vh; background: ${COLORS.bg}; font-family: 'Inter', -apple-system, sans-serif; color: ${COLORS.ink}; }
        .eco-lb .display { font-family: 'Fraunces', Georgia, serif; }
        .eco-lb .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .lb-wrap { max-width: 640px; margin: 0 auto; padding: 32px 20px 60px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${COLORS.inkSoft}; font-weight: 600; margin: 0 0 6px; }
        .lb-title { font-size: 26px; font-weight: 600; margin: 0 0 24px; }

        .lb-list {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 20px;
          overflow: hidden;
        }
        .lb-row {
          display: grid;
          grid-template-columns: 40px 40px 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-bottom: 1px solid ${COLORS.border};
          opacity: 0;
          animation: rise 0.4s ease forwards;
        }
        .lb-row:last-child { border-bottom: none; }
        .lb-row.highlight {
          background: ${COLORS.primary}0d;
          border-top: 1px dashed ${COLORS.primary}55;
          border-bottom: none;
        }
        .lb-rank { display: flex; align-items: center; justify-content: center; font-size: 13px; color: ${COLORS.inkSoft}; }
        .lb-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: ${COLORS.primary}14; color: ${COLORS.primary};
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px;
        }
        .lb-name p { margin: 0; font-weight: 600; font-size: 14.5px; }
        .lb-streak {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 11.5px; color: ${COLORS.bronze}; margin-top: 2px;
        }
        .lb-score { font-weight: 600; font-size: 15px; color: ${COLORS.primary}; }

        .lb-you-note {
          text-align: center; font-size: 12px; color: ${COLORS.inkSoft};
          padding: 10px 0 0;
        }

        .skeleton-row { height: 62px; border-bottom: 1px solid ${COLORS.border}; }
        .skeleton {
          background: linear-gradient(90deg, ${COLORS.border} 25%, #eef2ea 37%, ${COLORS.border} 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }

        @keyframes rise { to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
        @media (prefers-reduced-motion: reduce) {
          .lb-row { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      <Navbar />

      <div className="lb-wrap">
        <p className="eyebrow">Leaderboard</p>
        <h1 className="display lb-title">Top green scores</h1>

        {loading || !data ? (
          <div className="lb-list">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-row skeleton" />
            ))}
          </div>
        ) : (
          <>
            <div className="lb-list">
              {data.topUsers.map((u, i) => (
                <LeaderRow key={u._id} user={u} rank={i + 1} highlight={u._id === data.you.id} />
              ))}
              {!data.you.inTop && (
                <LeaderRow user={data.you} rank={data.you.rank} highlight />
              )}
            </div>
            {!data.you.inTop && (
              <p className="lb-you-note">
                <Trophy size={12} style={{ verticalAlign: "-1px" }} /> Your current rank — keep logging to climb up
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;