import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

function postToEsewa(formUrl, fields) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = formUrl;

  Object.entries(fields || {}).forEach(([k, v]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = String(v ?? "");
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export default function Checkout() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // load cart + user defaults
  useEffect(() => {
    let parsed = [];
    try {
      const raw = localStorage.getItem("cart");
      parsed = raw ? JSON.parse(raw) : [];
    } catch {
      parsed = [];
    }
    setCart(Array.isArray(parsed) ? parsed : []);

    setDeliveryAddress(user?.address || "");
    setDistrict(user?.district || "");
    setMunicipality(user?.municipality || "");
  }, [user]);

  const total = useMemo(() => {
    return cart.reduce((sum, it) => {
      const qty = Number(it.quantity || 0);
      const price = Number(it.price || it.unitPrice || 0);
      return sum + qty * price;
    }, 0);
  }, [cart]);

  const placeOrder = async () => {
    setErr("");

    if (!user) return nav("/login");
    if (user.role !== "BUYER") return setErr("Only buyers can checkout.");
    if (!cart.length) return setErr("Cart is empty.");

    try {
      setLoading(true);

      // 1) Create order in backend
      const { data } = await api.post("/api/orders", {
        paymentMethod,
        items: cart.map((it) => ({
          cropId: it.cropId || it.id, // support both shapes
          quantity: Number(it.quantity || 1),
        })),
        deliveryAddress,
        district,
        municipality,
      });

      if (!data?.ok) throw new Error(data?.error || "Order create failed");
      const orderId = data.order?.id;

      // 2) If COD -> go to orders
      if (paymentMethod === "COD") {
        localStorage.removeItem("cart");
        return nav("/buyer/orders");
      }

      // 3) If eSewa -> initiate payment and redirect via form POST
      // ✅ FIXED: /api/payments (not /api/payment)
      const init = await api.post(`/api/payments/esewa/initiate`, { orderId });

      if (!init.data?.ok) throw new Error(init.data?.error || "eSewa initiate failed");
      postToEsewa(init.data.formUrl, init.data.fields);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2>Checkout</h2>

      {err && (
        <div style={{ background: "#ffe7e7", border: "1px solid #ffb3b3", padding: 12, borderRadius: 10, marginBottom: 16 }}>
          {err}
        </div>
      )}

      <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {cart.map((it, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>{it.title || it.titleEn || "Item"}</div>
                <div>
                  {Number(it.quantity || 1)} × Rs {Number(it.price || it.unitPrice || 0)}
                </div>
              </div>
            ))}

            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <div>Total</div>
              <div>Rs {total}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        <input className="input" placeholder="Delivery Address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
        <input className="input" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
        <input className="input" placeholder="Municipality" value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Payment</label>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="radio" name="pay" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
            Cash on Delivery
          </label>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="radio" name="pay" value="ESEWA" checked={paymentMethod === "ESEWA"} onChange={() => setPaymentMethod("ESEWA")} />
            Pay with eSewa
          </label>
        </div>
      </div>

      <button className="btn primary" disabled={loading || cart.length === 0} onClick={placeOrder}>
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
