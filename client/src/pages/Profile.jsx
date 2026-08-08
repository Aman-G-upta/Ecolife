import React, { useEffect, useState } from "react";
import { Leaf, Activity, Flame, Award, Calendar } from "lucide-react";
import API from "../services/api";
import Navbar from "../components/Navbar";



const COLORS = {
  bg: "#F4F7F1",
  surface: "#FFFFFF",
  ink: "#16241C",
  inkSoft: "#52796F",
  primary: "#1B4332",
  gold: "#D9A544",
  rust: "#C1502E",
  ringTrack: "#E3E9DE",
  border: "#E1E8DC",
};

function GrowthRing({ greenScore }) {
  const level = Math.floor(greenScore / 100) + 1;
  const progress = greenScore % 100;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="pf-ring">
      <svg viewBox="0 0 150 150" width="150" height="150">
        <circle cx="75" cy="75" r={radius} fill="none" stroke={COLORS.ringTrack} strokeWidth="10" />
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 75 75)"
          className="pf-ring-progress"
        />
      </svg>
      <div className="pf-ring-center">
        <span className="pf-ring-level">Level {level}</span>
        <span className="pf-ring-score">{greenScore}</span>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value }) {
  return (
    <div className="pf-stat">
      <div className="pf-stat-icon">{icon}</div>
      <div>
        <p className="pf-stat-value">{value}</p>
        <p className="pf-stat-label">{label}</p>
      </div>
    </div>
  );
}

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  return (
    <div className="eco-pf">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

        .eco-pf { min-height: 100vh; background: ${COLORS.bg}; font-family: 'Inter', -apple-system, sans-serif; color: ${COLORS.ink}; }
        .eco-pf .display { font-family: 'Fraunces', Georgia, serif; }
        .eco-pf .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .pf-wrap { max-width: 720px; margin: 0 auto; padding: 32px 20px 60px; }

        .pf-header {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 22px;
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }

        .pf-ring { position: relative; width: 150px; height: 150px; flex-shrink: 0; }
        .pf-ring-progress { transition: stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1); }
        .pf-ring-center {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .pf-ring-level { font-size: 12px; color: ${COLORS.inkSoft}; font-weight: 500; }
        .pf-ring-score {
          font-family: 'Fraunces', Georgia, serif; font-size: 30px; font-weight: 600;
          color: ${COLORS.primary}; line-height: 1.1;
        }

        .pf-name { font-size: 24px; font-weight: 600; margin: 0 0 4px; }
        .pf-email { font-size: 14px; color: ${COLORS.inkSoft}; margin: 0 0 10px; }
        .pf-member-since {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; color: ${COLORS.inkSoft};
        }

        .pf-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 20px;
        }
        @media (max-width: 560px) {
          .pf-stats-grid { grid-template-columns: 1fr; }
        }

        .pf-stat {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pf-stat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: ${COLORS.primary}12; color: ${COLORS.primary};
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pf-stat-value { margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 19px; font-weight: 600; }
        .pf-stat-label { margin: 0; font-size: 11.5px; color: ${COLORS.inkSoft}; }

        .pf-badges {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 18px;
          padding: 22px;
          margin-top: 16px;
        }
        .pf-badges h2 { font-size: 15px; font-weight: 600; margin: 0 0 14px; display: flex; align-items: center; gap: 6px; }
        .pf-badge-shelf { display: flex; flex-wrap: wrap; gap: 10px; }
        .pf-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: ${COLORS.gold}14; color: #8a6416;
          padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;
        }
        .pf-empty { font-size: 13.5px; color: ${COLORS.inkSoft}; }

        .skeleton {
          background: linear-gradient(90deg, ${COLORS.border} 25%, #eef2ea 37%, ${COLORS.border} 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
          border-radius: 18px;
        }
        @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
      `}</style>

      <Navbar />

      <div className="pf-wrap">
        {loading || !user ? (
          <div>
            <div className="skeleton" style={{ height: 190 }} />
            <div className="pf-stats-grid" style={{ marginTop: 20 }}>
              <div className="skeleton" style={{ height: 68 }} />
              <div className="skeleton" style={{ height: 68 }} />
              <div className="skeleton" style={{ height: 68 }} />
            </div>
          </div>
        ) : (
          <>
            <div className="pf-header">
              <GrowthRing greenScore={user.greenScore} />
              <div>
                <h1 className="display pf-name">{user.name}</h1>
                <p className="pf-email">{user.email}</p>
                {memberSince && (
                  <span className="pf-member-since">
                    <Calendar size={13} /> Member since {memberSince}
                  </span>
                )}
              </div>
            </div>

            <div className="pf-stats-grid">
              <StatPill icon={<Activity size={18} />} label="Activities logged" value={user.totalActivities ?? 0} />
              <StatPill icon={<Flame size={18} />} label="Current streak" value={`${user.streak} days`} />
              <StatPill icon={<Leaf size={18} />} label="Total XP" value={user.xp} />
            </div>

            <div className="pf-badges">
              <h2>
                <Award size={16} color={COLORS.gold} /> Badges earned
              </h2>
              {user.badges?.length > 0 ? (
                <div className="pf-badge-shelf">
                  {user.badges.map((b, i) => (
                    <span key={i} className="pf-badge">
                      <Award size={13} /> {b}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="pf-empty">
                  No badges yet — complete a challenge to earn your first one.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;