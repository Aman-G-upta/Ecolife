import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Leaf,
  Home,
  Trophy,
  Award,
  ScanLine,
  User,
  PlusCircle,
  LogOut,
} from "lucide-react";

const COLORS = {
  bg: "#F4F7F1",
  surface: "#FFFFFF",
  ink: "#16241C",
  inkSoft: "#52796F",
  primary: "#1B4332",
  primaryDeep: "#10281D",
  gold: "#D9A544",
  rust: "#C1502E",
  border: "#E1E8DC",
};

const NAV_LINKS = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/leaderboard", icon: Trophy, label: "Ranks" },
  { path: "/challenges", icon: Award, label: "Challenges" },
  { path: "/scanner", icon: ScanLine, label: "Scanner" },
  { path: "/profile", icon: User, label: "Profile" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="eco-navbar">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        .eco-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: ${COLORS.bg}f5;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid ${COLORS.border};
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .navbar-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Brand */
        .navbar-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          font-size: 17px;
          color: ${COLORS.primary};
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 10px;
          transition: background 0.15s ease;
          flex-shrink: 0;
        }
        .navbar-brand:hover {
          background: ${COLORS.primary}0d;
        }
        .navbar-brand:focus-visible {
          outline: 2px solid ${COLORS.primary};
          outline-offset: 2px;
        }

        /* Center nav rail */
        .nav-rail {
          display: flex;
          align-items: center;
          gap: 2px;
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 999px;
          padding: 4px;
          box-shadow: 0 1px 3px rgba(22, 36, 28, 0.04);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          min-width: 58px;
          height: 48px;
          padding: 0 6px;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: ${COLORS.inkSoft};
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: inherit;
        }
        .nav-item:hover {
          background: ${COLORS.primary}0c;
          color: ${COLORS.primary};
        }
        .nav-item.is-active {
          background: ${COLORS.primary};
          color: #fff;
          box-shadow: 0 4px 12px rgba(27, 67, 50, 0.25);
        }
        .nav-item:active {
          transform: scale(0.96);
        }
        .nav-item:focus-visible {
          outline: 2px solid ${COLORS.primary};
          outline-offset: 2px;
        }

        .nav-item-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.01em;
          line-height: 1;
          opacity: 0.9;
        }
        .nav-item.is-active .nav-item-label {
          opacity: 1;
        }

        /* Right actions */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          font-weight: 600;
          font-size: 13.5px;
          padding: 9px 16px;
          border-radius: 999px;
          cursor: pointer;
          border: 1px solid transparent;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .nav-btn:active {
          transform: scale(0.97);
        }
        .nav-btn:focus-visible {
          outline: 2px solid ${COLORS.primary};
          outline-offset: 2px;
        }

        .nav-btn-primary {
          background: ${COLORS.primary};
          color: #fff;
          border: none;
        }
        .nav-btn-primary:hover {
          background: ${COLORS.primaryDeep};
          box-shadow: 0 6px 16px rgba(27, 67, 50, 0.28);
        }

        .nav-btn-ghost {
          background: transparent;
          color: ${COLORS.rust};
          border-color: ${COLORS.border};
        }
        .nav-btn-ghost:hover {
          background: ${COLORS.rust}10;
          border-color: ${COLORS.rust}40;
        }

        /* ========== Mobile ========== */
        @media (max-width: 720px) {
          .navbar-inner {
            padding: 8px 12px;
            gap: 8px;
          }

          .navbar-brand span.brand-text {
            display: none;
          }

          .nav-rail {
            flex: 1;
            justify-content: space-between;
            padding: 3px;
            gap: 0;
          }

          .nav-item {
            min-width: 0;
            flex: 1;
            height: 46px;
            padding: 0 2px;
            border-radius: 14px;
          }

          .nav-item-label {
            font-size: 9.5px;
          }

          .nav-btn {
            padding: 9px 12px;
          }
          .nav-btn .btn-label {
            display: none;
          }
        }

        /* Very small phones */
        @media (max-width: 380px) {
          .nav-item {
            height: 44px;
          }
          .nav-item-label {
            font-size: 9px;
          }
        }
      `}</style>

      <div className="navbar-inner">
        {/* Brand */}
        <button
          className="navbar-brand"
          onClick={() => navigate("/dashboard")}
          aria-label="EcoLife AI Home"
        >
          <Leaf size={20} strokeWidth={2.2} />
          <span className="brand-text">EcoLife AI</span>
        </button>

        {/* Center navigation */}
        <nav className="nav-rail" aria-label="Main navigation">
          {NAV_LINKS.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              title={label}
              aria-label={label}
              aria-current={isActive(path) ? "page" : undefined}
              className={`nav-item ${isActive(path) ? "is-active" : ""}`}
              onClick={() => navigate(path)}
            >
              <Icon size={17} strokeWidth={isActive(path) ? 2.4 : 2} />
              <span className="nav-item-label">{label}</span>
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="navbar-actions">
          <button
            onClick={() => navigate("/add")}
            className="nav-btn nav-btn-primary"
            aria-label="Add Activity"
          >
            <PlusCircle size={16} strokeWidth={2.2} />
            <span className="btn-label">Add Activity</span>
          </button>

          <button
            onClick={handleLogout}
            className="nav-btn nav-btn-ghost"
            aria-label="Logout"
          >
            <LogOut size={15} strokeWidth={2.2} />
            <span className="btn-label">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;