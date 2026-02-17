import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function PricePrediction() {
  const [products, setProducts] = useState([]);
  const [cropName, setCropName] = useState("");
  const [horizonDays, setHorizonDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/price/products");
        const list =
          Array.isArray(data) ? data :
          Array.isArray(data?.products) ? data.products :
          [];
        setProducts(list);
      } catch (e) {
        console.error("Products load failed:", e?.response?.data || e.message);
        setProducts([]);
      }
    })();
  }, []);

  const predict = async () => {
    try {
      setErr("");
      setLoading(true);
      setResult(null);
      if (!cropName) throw new Error("Please select a crop");
      const { data } = await api.post("/api/price/predict", {
        cropName,
        horizonDays: Number(horizonDays),
      });
      if (!data.ok) throw new Error(data.error || "Prediction failed");
      setResult(data);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const confidencePct = result ? Math.round(result.confidence * 100) : 0;
  const confidenceColor =
    confidencePct >= 75 ? "#4a7c3b" :
    confidencePct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: "24px" }}>
      <style>{`
        @media (max-width: 968px) {
          .prediction-layout { flex-direction: column !important; }
          .info-sidebar { width: 100% !important; }
        }
        @media (max-width: 640px) {
          .prediction-wrapper { padding: 16px !important; }
          .result-row { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>

      <div className="prediction-wrapper" style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1a1a1a", margin: 0, marginBottom: "8px" }}>
            AI Price Prediction
          </h1>
          <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
            Get smart price forecasts powered by machine learning
          </p>
        </div>

        <div className="prediction-layout" style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

          {/* Main Card */}
          <div style={{
            flex: 1,
            background: "white",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0"
          }}>
            {/* Card Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "28px",
              paddingBottom: "20px",
              borderBottom: "1px solid #f0f0f0"
            }}>
              <div style={{
                width: "48px", height: "48px",
                background: "#e8f5e9",
                borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px"
              }}>
                💰
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a" }}>
                  Price Forecast Tool
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>
                  Predict future crop prices with AI
                </div>
              </div>
            </div>

            {/* Error */}
            {err && (
              <div style={{
                padding: "14px 16px",
                background: "#ffebee",
                border: "1px solid #ffcdd2",
                borderRadius: "8px",
                color: "#c62828",
                fontSize: "14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                ⚠️ {err}
              </div>
            )}

            {/* Crop Select */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px"
              }}>
                Select Crop
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  background: "white",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  transition: "border 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c3b"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              >
                <option value="">-- Select a Crop --</option>
                {products.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Days Ahead */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px"
              }}>
                Days Ahead
                <span style={{
                  marginLeft: "8px",
                  fontSize: "13px",
                  fontWeight: "400",
                  color: "#666"
                }}>
                  (1 – 60 days)
                </span>
              </label>

              {/* Slider + Input combo */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={horizonDays}
                  onChange={(e) => setHorizonDays(e.target.value)}
                  style={{
                    flex: 1,
                    accentColor: "#4a7c3b",
                    height: "4px",
                    cursor: "pointer"
                  }}
                />
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={horizonDays}
                  onChange={(e) => setHorizonDays(e.target.value)}
                  style={{
                    width: "72px",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "center",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4a7c3b"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Quick Day Presets */}
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                {[7, 14, 30, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setHorizonDays(d)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor: Number(horizonDays) === d ? "#4a7c3b" : "#e0e0e0",
                      background: Number(horizonDays) === d ? "#e8f5e9" : "white",
                      color: Number(horizonDays) === d ? "#4a7c3b" : "#666",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Predict Button */}
            <button
              onClick={predict}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#a5d6a7" : "#4a7c3b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
              onMouseOver={(e) => { if (!loading) e.target.style.background = "#3d6630"; }}
              onMouseOut={(e) => { if (!loading) e.target.style.background = "#4a7c3b"; }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "16px", height: "16px",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite"
                  }}></span>
                  Predicting...
                </>
              ) : (
                <> 🔮 Predict Price </>
              )}
            </button>

            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            {/* Result Card */}
            {result && (
              <div style={{
                marginTop: "24px",
                background: "linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)",
                border: "1px solid #c8e6c9",
                borderRadius: "12px",
                padding: "24px"
              }}>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#4a7c3b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "12px"
                }}>
                  ✅ Prediction Result
                </div>

                {/* Price */}
                <div style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  color: "#1a1a1a",
                  marginBottom: "4px"
                }}>
                  रु {result.predicted}
                  <span style={{ fontSize: "18px", fontWeight: "400", color: "#666" }}> / kg</span>
                </div>

                <div style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                  Forecast for <strong style={{ color: "#1a1a1a" }}>{cropName}</strong> over{" "}
                  <strong style={{ color: "#1a1a1a" }}>{horizonDays} days</strong>
                </div>

                {/* Confidence + Model row */}
                <div className="result-row" style={{ display: "flex", gap: "16px" }}>
                  {/* Confidence */}
                  <div style={{
                    flex: 1,
                    background: "white",
                    borderRadius: "8px",
                    padding: "14px",
                    border: "1px solid #e0e0e0"
                  }}>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                      CONFIDENCE
                    </div>
                    {/* Progress bar */}
                    <div style={{
                      height: "6px",
                      background: "#e0e0e0",
                      borderRadius: "3px",
                      marginBottom: "8px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${confidencePct}%`,
                        background: confidenceColor,
                        borderRadius: "3px",
                        transition: "width 0.6s ease"
                      }}></div>
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: confidenceColor }}>
                      {confidencePct}%
                    </div>
                  </div>

                  {/* Model */}
                  <div style={{
                    flex: 1,
                    background: "white",
                    borderRadius: "8px",
                    padding: "14px",
                    border: "1px solid #e0e0e0"
                  }}>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                      MODEL VERSION
                    </div>
                    <div style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "#e8f5e9",
                      color: "#4a7c3b",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px"
                    }}>
                      {result.modelVersion || "v1.0"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>AI-powered</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="info-sidebar" style={{ width: "300px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* How it works */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e0e0e0"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: 0, marginBottom: "16px" }}>
                How It Works
              </h3>
              {[
                { icon: "📊", title: "Market Data", desc: "Trained on historical market prices from Nepal" },
                { icon: "🤖", title: "AI Model", desc: "Machine learning forecasts future price trends" },
                { icon: "📅", title: "Select Horizon", desc: "Choose how many days ahead to predict" },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                  <div style={{
                    width: "36px", height: "36px",
                    background: "#f0fdf4",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a1a", marginBottom: "2px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={{
              background: "linear-gradient(135deg, #4a7c3b, #6b9c5a)",
              borderRadius: "12px",
              padding: "24px",
              color: "white"
            }}>
              <div style={{ fontSize: "20px", marginBottom: "10px" }}>💡</div>
              <h3 style={{ fontSize: "15px", fontWeight: "600", margin: 0, marginBottom: "10px" }}>
                Pro Tip
              </h3>
              <p style={{ fontSize: "13px", lineHeight: "1.6", margin: 0, opacity: 0.9 }}>
                Shorter horizons (7–14 days) tend to have higher confidence. Use longer horizons for planning purposes only.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}