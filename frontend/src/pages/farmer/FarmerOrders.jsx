// src/pages/farmer/FarmerOrders.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useNavigate } from "react-router-dom";

export default function FarmerOrders() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      // ✅ Farmer-specific endpoint
      // Backend should implement: GET /api/orders/farmer
      // It should return orders where order items belong to crops owned by this farmer.
      const { data } = await api.get("/api/orders/farmer");
      if (data?.ok) setOrders(data.orders || []);
      else setOrders(data.orders || []);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // safety: if someone opens this page without farmer role
    if (!user) return nav("/login");
    if (user.role !== "FARMER") return nav("/");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setErr("");

      // ✅ Farmer updates order status
      // Backend should implement: PATCH /api/orders/:id/status
      // Body: { status } and authorize FARMER
      const { data } = await api.patch(`/api/orders/${orderId}/status`, { status });

      if (!data?.ok) throw new Error(data?.error || "Failed to update status");
      await load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  const statusBadge = (s) => {
    const base = {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      border: "1px solid #ddd",
      background: "#f7f7f7",
      color: "#333",
    };

    if (s === "PENDING") return { ...base, background: "#fff6e6", borderColor: "#ffd59a", color: "#9a5b00" };
    if (s === "CONFIRMED") return { ...base, background: "#e8f5ff", borderColor: "#a8dcff", color: "#005b9a" };
    if (s === "DELIVERED") return { ...base, background: "#e8fff0", borderColor: "#a8ffc2", color: "#0b7a33" };
    if (s === "CANCELLED") return { ...base, background: "#ffe8e8", borderColor: "#ffb3b3", color: "#9a0000" };
    return base;
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Customer Orders</h2>
          <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
            Orders placed for your crops (Farmer view)
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={load} className="btn secondary">
            Refresh
          </button>
        </div>
      </div>

      {err && (
        <div style={{ color: "red", marginTop: 12, marginBottom: 12 }}>
          {err}
        </div>
      )}

      {loading ? (
        <p style={{ marginTop: 16 }}>Loading...</p>
      ) : orders.length === 0 ? (
        <p style={{ marginTop: 16 }}>No orders yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div>
                    <b>Order:</b> {o.id}
                  </div>

                  <div>
                    <b>Status:</b>{" "}
                    <span style={statusBadge(o.status)}>{o.status}</span>
                  </div>

                  <div>
                    <b>Payment:</b> {o.paymentMethod}{" "}
                    {o.paymentStatus ? `(${o.paymentStatus})` : ""}
                  </div>

                  <div>
                    <b>Total:</b> Rs. {o.totalAmount}
                  </div>

                  <div style={{ fontSize: 13, color: "#666" }}>
                    <b>Buyer:</b> {o.buyer?.fullName || "Buyer"}{" "}
                    {o.buyer?.email ? `• ${o.buyer.email}` : ""}
                  </div>

                  <div style={{ fontSize: 13, color: "#666" }}>
                    <b>Delivery:</b> {o.deliveryAddress || "-"}{" "}
                    {o.district ? `, ${o.district}` : ""}{" "}
                    {o.municipality ? `, ${o.municipality}` : ""}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 220 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Update status</div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <button
                      className="btn secondary"
                      onClick={() => updateStatus(o.id, "CONFIRMED")}
                      disabled={o.status === "CONFIRMED" || o.status === "DELIVERED" || o.status === "CANCELLED"}
                    >
                      Confirm
                    </button>

                    <button
                      className="btn secondary"
                      onClick={() => updateStatus(o.id, "DELIVERED")}
                      disabled={o.status === "DELIVERED" || o.status === "CANCELLED"}
                    >
                      Delivered
                    </button>

                    <button
                      className="btn secondary"
                      onClick={() => updateStatus(o.id, "CANCELLED")}
                      disabled={o.status === "CANCELLED" || o.status === "DELIVERED"}
                      style={{ borderColor: "#ffb3b3" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />

              <div style={{ fontWeight: 700, marginBottom: 6 }}>Items</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {(o.items || []).map((it) => (
                  <li key={it.id} style={{ marginBottom: 6 }}>
                    {it.crop?.titleEn || it.crop?.titleNp || "Crop"} — {it.quantity} × Rs.{it.unitPrice}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      <div style={{ marginTop: 18, fontSize: 12, color: "#666" }}>
        If you get <b>404</b> for <code>/api/orders/farmer</code> or <code>/api/orders/:id/status</code>,
        it means your backend routes/controllers are not created yet for farmer orders.
      </div>
    </div>
  );
}
