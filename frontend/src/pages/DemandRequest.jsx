import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

export default function PostDemand() {
  const nav = useNavigate();
  const { user, setUser } = useAuth();

  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [budget, setBudget] = useState("");
  const [preferredDistrict, setPreferredDistrict] = useState("");
  const [preferredMunicipality, setPreferredMunicipality] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");

  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Auto-fill user info
  useEffect(() => {
    if (dataLoaded) return;

    if (user) {
      setBuyerName(user.fullName || "");
      setBuyerPhone(user.phone || "");
      setDeliveryAddress(user.address || "");
      setPreferredDistrict(user.district || "");
      setPreferredMunicipality(user.municipality || "");
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setDataLoaded(true);
          return;
        }

        const { data } = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.ok && data.user) {
          const freshUser = data.user;

          setBuyerName(freshUser.fullName || "");
          setBuyerPhone(freshUser.phone || "");
          setDeliveryAddress(freshUser.address || "");
          setPreferredDistrict(freshUser.district || "");
          setPreferredMunicipality(freshUser.municipality || "");

          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        }
      } catch (error) {
        console.log("Could not fetch fresh user data for demand posting");
        try {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) {
            setBuyerName(storedUser.fullName || "");
            setBuyerPhone(storedUser.phone || "");
            setDeliveryAddress(storedUser.address || "");
            setPreferredDistrict(storedUser.district || "");
            setPreferredMunicipality(storedUser.municipality || "");
          }
        } catch {}
      } finally {
        setDataLoaded(true);
      }
    };

    fetchUserData();
  }, []); // run once

  const estimatedText = useMemo(() => {
    const q = Number(quantity || 0);
    const b = Number(budget || 0);
    if (!q || !b) return "Not enough info";
    return `रु ${(q * b).toLocaleString()}`;
  }, [quantity, budget]);

  const submitDemand = async () => {
    setErr("");
    setSuccess("");

    if (!user) return nav("/login");
    if (user.role !== "BUYER") return setErr("Only buyers can post demand requests.");

    if (!cropName.trim()) return setErr("Please enter crop/product name.");
    if (!quantity || Number(quantity) <= 0) return setErr("Please enter a valid quantity.");
    if (!unit.trim()) return setErr("Please select a unit.");
    if (!buyerName.trim()) return setErr("Please enter buyer name.");
    if (!buyerPhone.trim()) return setErr("Please enter buyer phone.");
    if (!preferredDistrict.trim()) return setErr("Please enter preferred district.");
    if (!deliveryAddress.trim()) return setErr("Please enter delivery address.");

    try {
      setLoading(true);

      const payload = {
        cropName: cropName.trim(),
        quantity: Number(quantity),
        unit: unit.trim(),
        budget: budget ? Number(budget) : null,
        preferredDistrict: preferredDistrict.trim(),
        preferredMunicipality: preferredMunicipality.trim(),
        deliveryAddress: deliveryAddress.trim(),
        description: description.trim(),
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
      };

      const { data } = await api.post("/api/demands", payload);

      if (!data?.ok) throw new Error(data?.error || "Failed to post demand");

      setSuccess("Demand request posted successfully!");

      // Reset only demand-specific fields
      setCropName("");
      setQuantity("");
      setUnit("kg");
      setBudget("");
      setDescription("");

      // redirect after short delay
      setTimeout(() => {
        nav("/buyer/demands");
      }, 1200);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Failed to post demand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: "24px" }}>
      <style>{`
        @media (max-width: 968px) {
          .demand-layout { flex-direction: column !important; }
          .demand-sidebar { width: 100% !important; position: static !important; }
        }
        @media (max-width: 640px) {
          .demand-container { padding: 16px !important; }
          .demand-grid-2 { grid-template-columns: 1fr !important; }
          .demand-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="demand-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1a1a1a",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Post Demand Request
          </h1>
          <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
            Tell farmers what products you need and receive matching offers
          </p>
        </div>

        {/* Error */}
        {err && (
          <div
            style={{
              padding: "14px 16px",
              background: "#ffebee",
              border: "1px solid #ffcdd2",
              borderRadius: "8px",
              color: "#c62828",
              fontSize: "14px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⚠️ {err}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            style={{
              padding: "14px 16px",
              background: "#e8f5e9",
              border: "1px solid #c8e6c9",
              borderRadius: "8px",
              color: "#2e7d32",
              fontSize: "14px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ✅ {success}
          </div>
        )}

        <div className="demand-layout" style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {/* Left */}
          <div style={{ flex: 1 }}>
            {/* Product Demand Info */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#e8f5e9",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  🌾
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                    Demand Details
                  </h2>
                  <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>
                    What product do you need?
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                    Product / Crop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tomato, Potato, Rice"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div className="demand-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      Quantity Needed
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g., 100"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="ton">ton</option>
                      <option value="dozen">dozen</option>
                      <option value="piece">piece</option>
                      <option value="liter">liter</option>
                      <option value="bag">bag</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      Budget per Unit (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g., 80"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                    Additional Description / Notes
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe quality, freshness, preferred variety, delivery timing, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "120px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Delivery & Buyer Info */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#e8f5e9",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  📍
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                    Buyer & Delivery Information
                  </h2>
                  <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>
                    Where and who should farmers contact?
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div className="demand-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      Buyer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div className="demand-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      Preferred District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Kathmandu"
                      value={preferredDistrict}
                      onChange={(e) => setPreferredDistrict(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      Preferred Municipality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., KMC"
                      value={preferredMunicipality}
                      onChange={(e) => setPreferredMunicipality(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="demand-sidebar" style={{ width: "400px", position: "sticky", top: "24px" }}>
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e0e0e0",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                  Demand Summary
                </h2>
              </div>

              <div style={{ display: "grid", gap: "14px", marginBottom: "20px" }}>
                <SummaryRow label="Product" value={cropName || "Not entered"} />
                <SummaryRow label="Quantity" value={quantity ? `${quantity} ${unit}` : "Not entered"} />
                <SummaryRow label="Budget / Unit" value={budget ? `रु ${Number(budget).toLocaleString()}` : "Not specified"} />
                <SummaryRow label="Preferred Location" value={preferredDistrict || "Not entered"} />
                <SummaryRow label="Estimated Total" value={estimatedText} highlight />
              </div>

              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#666",
                  lineHeight: "1.5",
                }}
              >
                Farmers will be able to see your demand request and contact you with matching supply offers.
              </div>

              <button
                onClick={submitDemand}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading ? "#e0e0e0" : "#4a7c3b",
                  color: loading ? "#999" : "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {loading ? "Posting..." : "📢 Post Demand"}
              </button>

              <button
                type="button"
                onClick={() => nav(-1)}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "12px",
                  background: "#fff",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ← Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        alignItems: "flex-start",
        paddingBottom: "10px",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <span style={{ fontSize: "14px", color: "#666" }}>{label}</span>
      <span
        style={{
          fontSize: highlight ? "16px" : "14px",
          fontWeight: highlight ? "700" : "600",
          color: highlight ? "#4a7c3b" : "#1a1a1a",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  background: "white",
};