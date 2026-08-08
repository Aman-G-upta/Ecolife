import React, { useRef, useState } from "react";
import {
  Upload,
  ScanLine,
  Loader2,
  Recycle,
  Leaf,
  AlertTriangle,
  Trash2,
  Cpu,
  RotateCcw,
} from "lucide-react";
import API from "../services/api";
import Navbar from "../components/Navbar";

/* Matches the design language used across the rest of the app —
   forest palette, Fraunces display serif, growth-ring motif. */

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

const CATEGORY_STYLE = {
  Recyclable: { color: COLORS.primary, icon: Recycle },
  Compostable: { color: COLORS.gold, icon: Leaf },
  Hazardous: { color: COLORS.rust, icon: AlertTriangle },
  Landfill: { color: COLORS.inkSoft, icon: Trash2 },
  "E-waste": { color: COLORS.primaryDeep, icon: Cpu },
};

// Strips the "data:image/png;base64," prefix FileReader adds,
// since the backend/Gemini only wants the raw base64 payload.
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const Scanner = () => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selected) => {
    if (!selected || !selected.type.startsWith("image/")) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setError(null);
    try {
      const imageBase64 = await fileToBase64(file);
      const res = await API.post("/ai/scan", {
        imageBase64,
        mimeType: file.type,
      });
      setResult(res.data.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Couldn't scan this photo — try again"
      );
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const categoryStyle = result ? CATEGORY_STYLE[result.category] : null;
  const CategoryIcon = categoryStyle?.icon || Recycle;

  return (
    <div className="eco-sc">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

        .eco-sc { min-height: 100vh; background: ${COLORS.bg}; font-family: 'Inter', -apple-system, sans-serif; color: ${COLORS.ink}; }
        .eco-sc .display { font-family: 'Fraunces', Georgia, serif; }
        .eco-sc .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .sc-wrap { max-width: 560px; margin: 0 auto; padding: 32px 20px 60px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${COLORS.inkSoft}; font-weight: 600; margin: 0 0 6px; }
        .sc-h1 { font-size: 26px; font-weight: 600; margin: 0 0 24px; }

        .dropzone {
          border: 2px dashed ${COLORS.border};
          border-radius: 20px;
          background: ${COLORS.surface};
          padding: 40px 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .dropzone:hover, .dropzone.drag-over {
          border-color: ${COLORS.primary};
          background: ${COLORS.primary}08;
        }
        .dropzone-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: ${COLORS.primary}12; color: ${COLORS.primary};
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
        }
        .dropzone-text { font-weight: 600; font-size: 14.5px; margin: 0 0 4px; }
        .dropzone-sub { font-size: 12.5px; color: ${COLORS.inkSoft}; margin: 0; }

        .preview-card {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 20px;
          padding: 16px;
        }
        .preview-img {
          width: 100%; max-height: 320px; object-fit: cover;
          border-radius: 14px; display: block;
        }

        .btn-scan {
          width: 100%;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: ${COLORS.primary};
          color: #fff; border: none;
          padding: 13px; border-radius: 12px;
          font-size: 15px; font-weight: 600; font-family: inherit;
          cursor: pointer; margin-top: 14px;
          transition: box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
        }
        .btn-scan:hover:not(:disabled) { box-shadow: 0 10px 24px rgba(27,67,50,0.25); }
        .btn-scan:active:not(:disabled) { transform: scale(0.98); }
        .btn-scan:disabled { opacity: 0.7; cursor: not-allowed; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .btn-reset {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; border: 1px solid ${COLORS.border}; color: ${COLORS.inkSoft};
          padding: 9px 16px; border-radius: 999px; font-size: 13px; font-weight: 600;
          cursor: pointer; margin-top: 12px;
        }
        .btn-reset:hover { background: ${COLORS.surface}; }

        .result-card {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 20px;
          padding: 24px;
          margin-top: 18px;
          opacity: 0;
          animation: rise 0.4s ease forwards;
        }
        @keyframes rise { to { opacity: 1; } }

        .result-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px;
          font-size: 12.5px; font-weight: 700;
          margin-bottom: 12px;
        }
        .result-item { font-size: 20px; font-weight: 600; margin: 0 0 10px; }
        .result-instructions { font-size: 14px; line-height: 1.6; color: ${COLORS.ink}; margin: 0 0 14px; }

        .result-tip {
          display: flex; gap: 8px;
          background: ${COLORS.gold}14; color: #8a6416;
          border-radius: 12px; padding: 12px 14px;
          font-size: 13px; line-height: 1.5;
        }

        .error-box {
          margin-top: 16px; padding: 12px 16px; border-radius: 12px;
          background: ${COLORS.rust}12; color: ${COLORS.rust};
          font-size: 13.5px; font-weight: 500;
        }
      `}</style>

      <Navbar />

      <div className="sc-wrap">
        <p className="eyebrow">
          <ScanLine size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} />
          AI Scanner
        </p>
        <h1 className="display sc-h1">What do I do with this?</h1>

        {!preview ? (
          <div
            className="dropzone"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="dropzone-icon">
              <Upload size={22} />
            </div>
            <p className="dropzone-text">Upload or drag a photo</p>
            <p className="dropzone-sub">We'll tell you exactly how to dispose of it</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        ) : (
          <div className="preview-card">
            <img src={preview} alt="Uploaded item" className="preview-img" />

            {!result && (
              <button className="btn-scan" onClick={handleScan} disabled={scanning}>
                {scanning ? (
                  <>
                    <Loader2 size={16} className="spin" /> Scanning...
                  </>
                ) : (
                  <>
                    <ScanLine size={16} /> Scan this item
                  </>
                )}
              </button>
            )}

            {error && <div className="error-box">{error}</div>}

            <button className="btn-reset" onClick={reset}>
              <RotateCcw size={13} /> Try another photo
            </button>
          </div>
        )}

        {result && (
          <div className="result-card">
            {result.fallback && (
              <div className="error-box" style={{ marginBottom: 14 }}>
                AI service is temporarily unavailable — showing general guidance instead.
              </div>
            )}
            <span
              className="result-tag"
              style={{ color: categoryStyle.color, background: `${categoryStyle.color}18` }}
            >
              <CategoryIcon size={14} /> {result.category}
            </span>
            <h2 className="display result-item">{result.item}</h2>
            <p className="result-instructions">{result.instructions}</p>
            {result.tip && (
              <div className="result-tip">
                <Leaf size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{result.tip}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;