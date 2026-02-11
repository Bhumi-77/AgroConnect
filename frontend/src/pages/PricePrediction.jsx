import React, { useState } from "react";
import { api } from "../lib/api";

export default function PricePrediction() {
  const [cropName, setCropName] = useState("Tomato");
  const [district, setDistrict] = useState("Kathmandu");
  const [horizonDays, setHorizonDays] = useState(7);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const predict = async () => {
    try {
      setErr("");
      setLoading(true);
      setResult(null);

      const { data } = await api.post("/api/price/predict", {
        cropName,
        district,
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

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>AI Price Prediction</h2>

        {err && <div className="card" style={{ background: "#ffecec" }}>{err}</div>}

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <div>
            <div className="small">Crop</div>
            <input className="input" value={cropName} onChange={(e) => setCropName(e.target.value)} />
          </div>

          <div>
            <div className="small">District</div>
            <input className="input" value={district} onChange={(e) => setDistrict(e.target.value)} />
          </div>

          <div>
            <div className="small">Days Ahead</div>
            <input className="input" type="number" min="1" max="60" value={horizonDays} onChange={(e) => setHorizonDays(e.target.value)} />
          </div>

          <button className="btn primary" onClick={predict} disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>

          {result && (
            <div className="card" style={{ background: "#f7fffb" }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                Predicted Price: रु {result.predicted} / kg
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                Confidence: {(result.confidence * 100).toFixed(0)}% • Model: {result.modelVersion || "v1.0"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
