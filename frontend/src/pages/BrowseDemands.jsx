import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function BrowseDemands() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const { data } = await api.get("/api/demands");
        if (data.ok) setDemands(data.demands);
      } catch {
        setErr("Failed to load demand requests");
      } finally {
        setLoading(false);
      }
    };
    fetchDemands();
  }, []);

  const filtered = demands.filter((d) =>
    d.cropName.toLowerCase().includes(search.toLowerCase()) ||
    d.preferredDistrict.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f0", padding: "40px 24px", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .browse-root { font-family: 'DM Sans', sans-serif; }

        .demand-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2ebe2;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        .demand-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(74, 124, 59, 0.12);
        }

        .card-header {
          background: linear-gradient(135deg, #4a7c3b 0%, #3d6831 100%);
          padding: 20px 22px 16px;
          position: relative;
        }

        .crop-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.25);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .crop-title {
          font-family: 'Lora', serif;
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin: 0;
          line-height: 1.2;
        }

        .qty-pill {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.95);
          color: #3d6831;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          line-height: 1;
        }

        .card-body {
          padding: 18px 22px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
        }
        .detail-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f0f4f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .detail-label {
          color: #888;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 1px;
        }
        .detail-value {
          color: #1a2e1a;
          font-size: 13.5px;
          font-weight: 500;
          line-height: 1.3;
        }

        .budget-highlight {
          background: #f0f9f0;
          border: 1px solid #c8e6c8;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }
        .budget-label { font-size: 12px; color: #5a8a5a; font-weight: 600; }
        .budget-value { font-size: 18px; font-weight: 700; color: #3d6831; font-family: 'Lora', serif; }

        .notes-box {
          background: #fafaf8;
          border-left: 3px solid #c8d8c8;
          border-radius: 0 8px 8px 0;
          padding: 10px 12px;
          font-size: 13px;
          color: #555;
          font-style: italic;
          line-height: 1.5;
        }

        .card-footer {
          padding: 14px 22px 20px;
          border-top: 1px solid #f0f0f0;
        }

        .buyer-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .buyer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4a7c3b, #6aad55);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .buyer-name { font-size: 14px; font-weight: 600; color: #1a2e1a; }
        .buyer-sub { font-size: 11px; color: #999; margin-top: 1px; }

        .contact-btn {
          width: 100%;
          padding: 11px;
          background: #4a7c3b;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
        }
        .contact-btn:hover { background: #3d6831; }
        .contact-btn.revealed {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #c8e6c9;
        }

        .search-wrap {
          position: relative;
          margin-bottom: 32px;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border-radius: 12px;
          border: 1.5px solid #d4e4d4;
          background: white;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a2e1a;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: #4a7c3b; }
        .search-input::placeholder { color: #aaa; }

        .stats-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .stat-chip {
          background: white;
          border: 1px solid #e2ebe2;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 13px;
          color: #5a8a5a;
          font-weight: 500;
        }
        .stat-chip strong { color: #3d6831; font-size: 18px; font-weight: 700; display: block; font-family: 'Lora', serif; }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #999;
        }
        .empty-state .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-state h3 { font-family: 'Lora', serif; color: #555; font-size: 20px; margin: 0 0 8px; }
        .empty-state p { font-size: 14px; margin: 0; }

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .skeleton {
          background: white;
          border-radius: 16px;
          height: 320px;
          position: relative;
          overflow: hidden;
          border: 1px solid #e2ebe2;
        }
        .skeleton::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(74,124,59,0.06) 50%, transparent 100%);
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

        @media (max-width: 640px) {
          .page-title { font-size: 26px !important; }
          .stats-bar { gap: 10px; }
        }
      `}</style>

      <div
  className="browse-root"
  style={{
    width: "100%",
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "0 12px"
  }}
>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#4a7c3b", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
              Krishi Connect
            </span>
          </div>
          <h1 className="page-title" style={{ fontFamily: "'Lora', serif", fontSize: "34px", fontWeight: 700, color: "#1a2e1a", margin: "0 0 8px" }}>
            Buyer Demand Requests
          </h1>
          <p style={{ color: "#6a8a6a", fontSize: "15px", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            Browse what buyers need and reach out directly with your produce
          </p>
        </div>

        {/* Stats bar */}
        {!loading && !err && (
          <div className="stats-bar">
            <div className="stat-chip">
              <strong>{demands.length}</strong>
              Total requests
            </div>
            <div className="stat-chip">
              <strong>{[...new Set(demands.map(d => d.preferredDistrict))].length}</strong>
              Districts
            </div>
            <div className="stat-chip">
              <strong>{[...new Set(demands.map(d => d.cropName.toLowerCase()))].length}</strong>
              Crop types
            </div>
          </div>
        )}

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by crop name or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {err && (
          <div style={{ padding: "14px 16px", background: "#ffebee", border: "1px solid #ffcdd2", borderRadius: "10px", color: "#c62828", fontSize: "14px", marginBottom: "24px" }}>
            ⚠️ {err}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="loading-grid">
            {[1,2,3].map(i => <div key={i} className="skeleton" />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌾</div>
            <h3>No demand requests found</h3>
            <p>{search ? `No results for "${search}" — try a different search` : "No active demand requests at the moment"}</p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && filtered.length > 0 && (
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    width: "100%",
    alignItems: "stretch"
  }}
>
            {filtered.map((d) => (
              <DemandCard key={d.id} demand={d} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function DemandCard({ demand }) {
  const [showPhone, setShowPhone] = useState(false);
  const initials = demand.buyerName
    ? demand.buyerName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="demand-card">
      {/* Header */}
      <div className="card-header">
        <div className="crop-badge">
          <span style={{ fontSize: "11px" }}>🌿</span>
          Crop Demand
        </div>
        <div className="qty-pill">{demand.quantity} {demand.unit}</div>
        <h3 className="crop-title">{demand.cropName}</h3>
      </div>

      {/* Body */}
      <div className="card-body">

        {/* Budget highlight */}
        <div className="budget-highlight">
          <span className="budget-label">Budget per unit</span>
          <span className="budget-value">
            {demand.budget ? `रु ${Number(demand.budget).toLocaleString()}` : "Negotiable"}
          </span>
        </div>

        {/* Location */}
        <div className="detail-row">
          <div className="detail-icon">📍</div>
          <div>
            <div className="detail-label">Location</div>
            <div className="detail-value">
              {demand.preferredDistrict}
              {demand.preferredMunicipality && `, ${demand.preferredMunicipality}`}
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="detail-row">
          <div className="detail-icon">🚚</div>
          <div>
            <div className="detail-label">Delivery address</div>
            <div className="detail-value">{demand.deliveryAddress}</div>
          </div>
        </div>

        {/* Notes */}
        {demand.description && (
          <div className="notes-box">
            "{demand.description}"
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="buyer-row">
          <div className="buyer-avatar">{initials}</div>
          <div>
            <div className="buyer-name">{demand.buyerName}</div>
            <div className="buyer-sub">Verified Buyer</div>
          </div>
        </div>

        <button
          className={`contact-btn ${showPhone ? "revealed" : ""}`}
          onClick={() => setShowPhone(!showPhone)}
        >
          {showPhone ? (
            <><span>📞</span> {demand.buyerPhone}</>
          ) : (
            <><span>👁</span> Show Contact Number</>
          )}
        </button>
      </div>
    </div>
  );
}