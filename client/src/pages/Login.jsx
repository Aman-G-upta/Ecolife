import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Leaf, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { handleError, handleSuccess } from "../utils/index";



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

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("All fields are required");
    }

    setSubmitting(true);
    try {
      const url = "https://ecolife-ai.onrender.com/auth/login"; 

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      const { success, message, token, user } = result;

      if (success) {
        handleSuccess(message);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        handleError(message);
        setSubmitting(false);
      }
    } catch (error) {
      handleError("Something went wrong");
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <div className="eco-auth">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        .eco-auth {
          min-height: 100vh;
          background: ${COLORS.bg};
          font-family: 'Inter', -apple-system, sans-serif;
          color: ${COLORS.ink};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .eco-auth .display { font-family: 'Fraunces', Georgia, serif; }

        .auth-card {
          width: 100%;
          max-width: 880px;
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 24px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(27, 67, 50, 0.08);
        }
        @media (max-width: 720px) {
          .auth-card { grid-template-columns: 1fr; }
        }

        .auth-form-side { padding: 44px 44px 40px; }
        .auth-brand {
          display: inline-flex; align-items: center; gap: 8px;
          font-weight: 700; font-size: 15px; color: ${COLORS.primary};
          text-decoration: none; margin-bottom: 32px;
        }

        .eyebrow {
          font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
          color: ${COLORS.inkSoft}; font-weight: 600; margin: 0 0 6px 0;
        }
        .auth-title { font-size: 26px; font-weight: 600; margin: 0 0 28px 0; }

        .field { margin-bottom: 18px; }
        .field label {
          display: block; font-size: 13px; font-weight: 600; color: ${COLORS.ink};
          margin-bottom: 6px;
        }
        .input-wrap { position: relative; }
        .input-wrap svg {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: ${COLORS.inkSoft};
        }
        .input-wrap input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border-radius: 12px;
          border: 1px solid ${COLORS.border};
          background: ${COLORS.bg};
          font-size: 14px;
          font-family: inherit;
          color: ${COLORS.ink};
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }
        .input-wrap input::placeholder { color: #9AAB9C; }
        .input-wrap input:focus {
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 3px ${COLORS.primary}1a;
        }

        .btn-submit {
          width: 100%;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: ${COLORS.primary};
          color: #fff;
          border: none;
          padding: 13px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          margin-top: 8px;
          transition: box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
        }
        .btn-submit:hover:not(:disabled) { box-shadow: 0 10px 24px rgba(27,67,50,0.25); }
        .btn-submit:active:not(:disabled) { transform: scale(0.98); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-submit:focus-visible { outline: 2px solid ${COLORS.primary}; outline-offset: 2px; }
        .spin { animation: spin 0.8s linear infinite; }

        .auth-side-panel {
          background: ${COLORS.primary};
          color: #fff;
          padding: 44px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .auth-side-panel::before {
          content: "";
          position: absolute;
          width: 260px; height: 260px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 50%;
          top: -60px; right: -80px;
        }
        .auth-side-panel::after {
          content: "";
          position: absolute;
          width: 180px; height: 180px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          bottom: -50px; left: -60px;
        }
        .side-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.12);
          padding: 6px 12px; border-radius: 999px;
          font-size: 12px; font-weight: 600; margin-bottom: 18px;
        }
        .side-title { font-size: 21px; font-weight: 600; margin: 0 0 10px 0; }
        .side-copy { font-size: 13.5px; opacity: 0.8; line-height: 1.6; margin: 0 0 26px 0; max-width: 240px; }

        .btn-outline-light {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff; color: ${COLORS.primary};
          border: none; padding: 11px 22px; border-radius: 999px;
          font-size: 14px; font-weight: 600; text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-outline-light:hover { box-shadow: 0 10px 24px rgba(0,0,0,0.2); transform: translateY(-1px); }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="auth-card">
        <div className="auth-form-side">
          <Link to="/" className="auth-brand">
            <Leaf size={18} />
            EcoLife AI
          </Link>

          <p className="eyebrow">Welcome back</p>
          <h1 className="display auth-title">Log in to your ring</h1>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Email</label>
              <div className="input-wrap">
                <Mail size={16} />
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={loginInfo.email}
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <Lock size={16} />
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginInfo.password}
                />
              </div>
            </div>

            <button className="btn-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" /> Logging in...
                </>
              ) : (
                <>
                  Log in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="auth-side-panel">
          <span className="side-badge">
            <Sparkles size={13} /> New here?
          </span>
          <h2 className="display side-title">Start your first ring</h2>
          <p className="side-copy">
            Track your habits, grow your green score, and see it all add up —
            takes under a minute to join.
          </p>
          <Link to="/register" className="btn-outline-light">
            Create an account <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;