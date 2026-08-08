import React, { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Car, Zap, Droplet, Recycle, Salad, ArrowRight, Loader2, Leaf } from "lucide-react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { handleError, handleSuccess } from "../utils/index";


const COLORS = {
  bg: "#F4F7F1",
  surface: "#FFFFFF",
  ink: "#16241C",
  inkSoft: "#52796F",
  primary: "#1B4332",
  gold: "#D9A544",
  border: "#E1E8DC",
};

const ACTIVITY_TYPES = [
  { key: "travel", label: "Travel", unit: "km", icon: Car, factor: 0.2, field: "distance", credit: false },
  { key: "electricity", label: "Electricity", unit: "units", icon: Zap, factor: 0.5, field: "units", credit: false },
  { key: "water", label: "Water", unit: "litres", icon: Droplet, factor: 0.0003, field: "liters", credit: false },
  { key: "recycling", label: "Recycling", unit: "kg", icon: Recycle, factor: 0.15, field: "kg", credit: true },
  { key: "diet", label: "Plant meals", unit: "meals", icon: Salad, factor: 1.2, field: "meals", credit: true },
];

const AddActivity = () => {
  const [type, setType] = useState("travel");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeType = ACTIVITY_TYPES.find((t) => t.key === type);

  const estimatedCarbon = useMemo(() => {
    const num = Number(value);
    if (!num || num <= 0) return 0;
    return Math.round(num * activeType.factor * 100) / 100;
  }, [value, activeType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const num = Number(value);
    if (!value || isNaN(num) || num <= 0) {
      return handleError("Enter a value greater than 0");
    }

    const data = { [activeType.field]: num };

    setSubmitting(true);
    try {
      const res = await API.post("/activity", { type, data });
      const stats = res.data.stats;
      handleSuccess(
        stats ? `Activity added — green score now ${stats.greenScore}` : "Activity added"
      );
      setValue("");
    } catch (err) {
      console.error(err);
      handleError(err.response?.data?.message || "Couldn't add activity — try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="eco-add">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

        .eco-add { min-height: 100vh; background: ${COLORS.bg}; font-family: 'Inter', -apple-system, sans-serif; color: ${COLORS.ink}; }
        .eco-add .display { font-family: 'Fraunces', Georgia, serif; }
        .eco-add .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .add-wrap { max-width: 480px; margin: 48px auto; padding: 0 20px; }
        .add-card { background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 20px; padding: 32px; }

        .eyebrow { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${COLORS.inkSoft}; font-weight: 600; margin: 0 0 6px; }
        .add-title { font-size: 22px; font-weight: 600; margin: 0 0 24px; }

        .type-toggle {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
          gap: 10px;
          margin-bottom: 22px;
        }
        .type-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 14px 8px; border-radius: 14px;
          border: 1px solid ${COLORS.border}; background: ${COLORS.bg}; color: ${COLORS.inkSoft};
          cursor: pointer; font-family: inherit; font-weight: 600; font-size: 12.5px;
          transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, transform 0.1s ease;
        }
        .type-btn:hover { transform: translateY(-1px); }
        .type-btn:focus-visible { outline: 2px solid ${COLORS.primary}; outline-offset: 2px; }
        .type-btn.active { border-color: ${COLORS.primary}; background: ${COLORS.primary}0f; color: ${COLORS.primary}; }

        .field { margin-bottom: 8px; }
        .field label { display: block; font-size: 13px; font-weight: 600; color: ${COLORS.ink}; margin-bottom: 6px; }
        .input-wrap { position: relative; }
        .input-wrap input {
          width: 100%; padding: 12px 66px 12px 14px; border-radius: 12px;
          border: 1px solid ${COLORS.border}; background: ${COLORS.bg};
          font-size: 15px; font-family: inherit; color: ${COLORS.ink};
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .input-wrap input:focus { border-color: ${COLORS.primary}; box-shadow: 0 0 0 3px ${COLORS.primary}1a; }
        .input-unit { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 13px; color: ${COLORS.inkSoft}; font-weight: 600; }

        .estimate-row {
          display: flex; align-items: center; gap: 8px;
          margin: 18px 0 22px; padding: 12px 14px; border-radius: 12px;
          font-size: 13px; font-weight: 500;
        }
        .estimate-row.cost { background: ${COLORS.gold}14; color: #8a6416; }
        .estimate-row.credit { background: ${COLORS.primary}0f; color: ${COLORS.primary}; }
        .estimate-value { font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 600; }

        .btn-submit {
          width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: ${COLORS.primary}; color: #fff; border: none;
          padding: 13px; border-radius: 12px; font-size: 15px; font-weight: 600; font-family: inherit;
          cursor: pointer; transition: box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
        }
        .btn-submit:hover:not(:disabled) { box-shadow: 0 10px 24px rgba(27,67,50,0.25); }
        .btn-submit:active:not(:disabled) { transform: scale(0.98); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-submit:focus-visible { outline: 2px solid ${COLORS.primary}; outline-offset: 2px; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Navbar />

      <div className="add-wrap">
        <div className="add-card">
          <p className="eyebrow">Log an activity</p>
          <h1 className="display add-title">Add to your ring</h1>

          <form onSubmit={handleSubmit}>
            <div className="type-toggle">
              {ACTIVITY_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    type="button"
                    key={t.key}
                    className={`type-btn ${type === t.key ? "active" : ""}`}
                    onClick={() => {
                      setType(t.key);
                      setValue("");
                    }}
                  >
                    <Icon size={18} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="field">
              <label>{activeType.label} amount</label>
              <div className="input-wrap">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder={`Enter ${activeType.unit}`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <span className="input-unit">{activeType.unit}</span>
              </div>
            </div>

            <div className={`estimate-row ${activeType.credit ? "credit" : "cost"}`}>
              <Leaf size={15} />
              {activeType.credit ? "Estimated CO₂ saved:" : "Estimated impact:"}{" "}
              <span className="estimate-value">
                {Math.abs(estimatedCarbon)} kg CO₂
              </span>
            </div>

            <button className="btn-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" /> Adding...
                </>
              ) : (
                <>
                  Add activity <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddActivity;