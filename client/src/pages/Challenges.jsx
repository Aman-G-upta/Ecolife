import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Award, CheckCircle2, Target } from "lucide-react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { handleSuccess } from "../utils/index";


const COLORS = {
  bg: "#F4F7F1",
  surface: "#FFFFFF",
  ink: "#16241C",
  inkSoft: "#52796F",
  primary: "#1B4332",
  gold: "#D9A544",
  border: "#E1E8DC",
};

function ChallengeCard({ c }) {
  const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
  return (
    <div className={`ch-card ${c.completed ? "completed" : ""}`}>
      <div className="ch-card-top">
        <div className="ch-icon">
          {c.completed ? <CheckCircle2 size={18} /> : <Target size={18} />}
        </div>
        {c.completed && <span className="ch-done-tag">Completed</span>}
      </div>
      <h3 className="display ch-title">{c.title}</h3>
      <p className="ch-desc">{c.description}</p>

      <div className="ch-progress-track">
        <div className="ch-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="ch-progress-label mono">
        {c.progress} / {c.target} {c.unit}
      </div>
    </div>
  );
}

const Challenges = () => {
  const [challenges, setChallenges] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await API.get("/challenges");
        setChallenges(res.data.data.challenges);

        if (res.data.data.newlyEarned?.length > 0) {
          res.data.data.newlyEarned.forEach((badge) =>
            handleSuccess(`🏅 New badge earned: ${badge}`)
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  return (
    <div className="eco-ch">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

        .eco-ch { min-height: 100vh; background: ${COLORS.bg}; font-family: 'Inter', -apple-system, sans-serif; color: ${COLORS.ink}; }
        .eco-ch .display { font-family: 'Fraunces', Georgia, serif; }
        .eco-ch .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .ch-wrap { max-width: 900px; margin: 0 auto; padding: 32px 20px 60px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${COLORS.inkSoft}; font-weight: 600; margin: 0 0 6px; }
        .ch-title-h1 { font-size: 26px; font-weight: 600; margin: 0 0 24px; }

        .ch-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .ch-grid { grid-template-columns: 1fr; }
        }

        .ch-card {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 18px;
          padding: 20px;
          transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }
        .ch-card:hover { box-shadow: 0 10px 26px rgba(27,67,50,0.08); transform: translateY(-2px); }
        .ch-card.completed { border-color: ${COLORS.primary}55; background: ${COLORS.primary}08; }

        .ch-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .ch-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: ${COLORS.primary}12; color: ${COLORS.primary};
          display: flex; align-items: center; justify-content: center;
        }
        .ch-card.completed .ch-icon { background: ${COLORS.primary}; color: #fff; }
        .ch-done-tag {
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
          color: ${COLORS.primary}; background: ${COLORS.primary}14; padding: 3px 9px; border-radius: 999px;
        }

        .ch-title { font-size: 16.5px; font-weight: 600; margin: 0 0 5px; }
        .ch-desc { font-size: 13px; color: ${COLORS.inkSoft}; margin: 0 0 16px; line-height: 1.5; min-height: 34px; }

        .ch-progress-track {
          height: 8px; background: ${COLORS.border}; border-radius: 999px; overflow: hidden; margin-bottom: 8px;
        }
        .ch-progress-fill {
          height: 100%; background: ${COLORS.gold}; border-radius: 999px;
          transition: width 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .ch-card.completed .ch-progress-fill { background: ${COLORS.primary}; }
        .ch-progress-label { font-size: 12px; color: ${COLORS.inkSoft}; }

        .skeleton {
          background: linear-gradient(90deg, ${COLORS.border} 25%, #eef2ea 37%, ${COLORS.border} 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
          border-radius: 18px;
        }
        @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
      `}</style>

      <Navbar />

      <div className="ch-wrap">
        <p className="eyebrow">
          <Award size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} />
          Challenges
        </p>
        <h1 className="display ch-title-h1">Grow your ring, one challenge at a time</h1>

        {loading || !challenges ? (
          <div className="ch-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 148 }} />
            ))}
          </div>
        ) : (
          <div className="ch-grid">
            {challenges.map((c) => (
              <ChallengeCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Challenges;