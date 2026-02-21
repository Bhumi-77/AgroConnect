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

  // ✅ persist helper
  const saveCart = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  // ✅ remove single item
  const removeItem = (it) => {
    setErr("");
    const key = it.cropId || it.id; // supports both
    const next = cart.filter((x) => (x.cropId || x.id) !== key);
    saveCart(next);
  };

  // ✅ clear cart
  const clearCart = () => {
    setErr("");
    saveCart([]);
  };

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

      const { data } = await api.post("/api/orders", {
        paymentMethod,
        items: cart.map((it) => ({
          cropId: it.cropId || it.id,
          quantity: Number(it.quantity || 1),
        })),
        deliveryAddress,
        district,
        municipality,
      });

      if (!data?.ok) throw new Error(data?.error || "Order create failed");
      const orderId = data.order?.id;

      if (paymentMethod === "COD") {
        localStorage.removeItem("cart");
        return nav("/buyer/orders");
      }

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
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: "24px" }}>
      <style>{`
        @media (max-width: 968px) {
          .checkout-layout { flex-direction: column !important; }
          .checkout-sidebar { width: 100% !important; position: static !important; }
        }
        @media (max-width: 640px) {
          .checkout-container { padding: 16px !important; }
          .address-grid { grid-template-columns: 1fr !important; }
          .payment-options { flex-direction: column !important; }
        }
      `}</style>

      <div className="checkout-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1a1a1a", margin: 0, marginBottom: "8px" }}>
            Checkout
          </h1>
          <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
            Review your order and complete the purchase
          </p>
        </div>

        {err && (
          <div style={{
            padding: "14px 16px",
            background: "#ffebee",
            border: "1px solid #ffcdd2",
            borderRadius: "8px",
            color: "#c62828",
            fontSize: "14px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            ⚠️ {err}
          </div>
        )}

        <div className="checkout-layout" style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {/* Left */}
          <div style={{ flex: 1 }}>
            {/* Delivery */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "20px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "1px solid #f0f0f0"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "#e8f5e9",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  📍
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                    Delivery Information
                  </h2>
                  <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>
                    Where should we deliver your order?
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div className="address-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Kathmandu"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                      Municipality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., KMC"
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "1px solid #f0f0f0"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "#e8f5e9",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  💳
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                    Payment Method
                  </h2>
                  <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>
                    Choose your preferred payment option
                  </div>
                </div>
              </div>

              <div className="payment-options" style={{ display: "flex", gap: "12px" }}>
                <label style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  border: paymentMethod === "COD" ? "2px solid #4a7c3b" : "1px solid #e0e0e0",
                  borderRadius: "8px",
                  background: paymentMethod === "COD" ? "#e8f5e9" : "white",
                  cursor: "pointer"
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    style={{ width: "18px", height: "18px", accentColor: "#4a7c3b" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", marginBottom: "4px" }}>
                      💵 Cash on Delivery
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Pay when you receive</div>
                  </div>
                </label>

                <label style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  border: paymentMethod === "ESEWA" ? "2px solid #4a7c3b" : "1px solid #e0e0e0",
                  borderRadius: "8px",
                  background: paymentMethod === "ESEWA" ? "#e8f5e9" : "white",
                  cursor: "pointer"
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="ESEWA"
                    checked={paymentMethod === "ESEWA"}
                    onChange={() => setPaymentMethod("ESEWA")}
                    style={{ width: "18px", height: "18px", accentColor: "#4a7c3b" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", marginBottom: "4px" }}>
                      💳 eSewa
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Pay online securely</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="checkout-sidebar" style={{ width: "400px", position: "sticky", top: "24px" }}>
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e0e0e0"
            }}>
              {/* ✅ Header with Clear Cart */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                  Order Summary
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                  style={{
                    padding: "8px 10px",
                    background: cart.length === 0 ? "#f3f4f6" : "#fff",
                    color: cart.length === 0 ? "#9ca3af" : "#b91c1c",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: "800",
                    cursor: cart.length === 0 ? "not-allowed" : "pointer",
                  }}
                  title="Remove all items"
                >
                  🧹 Clear
                </button>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛒</div>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>Your cart is empty</div>
                </div>
              ) : (
                <>
                  <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "16px" }}>
                    {cart.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          padding: "12px 0",
                          borderBottom: idx < cart.length - 1 ? "1px solid #f0f0f0" : "none",
                          gap: "12px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", marginBottom: "4px" }}>
                            {it.title || it.titleEn || "Item"}
                          </div>

                          <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                            {Number(it.quantity || 1)} × रु {Number(it.price || it.unitPrice || 0)}
                          </div>

                          {/* ✅ Remove button per item */}
                          <button
                            type="button"
                            onClick={() => removeItem(it)}
                            style={{
                              padding: "6px 10px",
                              background: "#fff",
                              color: "#b91c1c",
                              border: "1px solid #fecaca",
                              borderRadius: "10px",
                              fontSize: "12px",
                              fontWeight: "800",
                              cursor: "pointer",
                            }}
                          >
                            ✕ Remove
                          </button>
                        </div>

                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a1a", whiteSpace: "nowrap" }}>
                          रु {(Number(it.quantity || 1) * Number(it.price || it.unitPrice || 0)).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: "14px", color: "#666" }}>
                    <span>Subtotal</span>
                    <span>रु {total.toLocaleString()}</span>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    fontSize: "14px",
                    color: "#666",
                    borderBottom: "1px solid #e0e0e0",
                  }}>
                    <span>Delivery</span>
                    <span style={{ color: "#4a7c3b", fontWeight: "600" }}>Free</span>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1a1a1a",
                  }}>
                    <span>Total</span>
                    <span style={{ color: "#4a7c3b" }}>रु {total.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={loading || cart.length === 0}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: loading || cart.length === 0 ? "#e0e0e0" : "#4a7c3b",
                      color: loading || cart.length === 0 ? "#999" : "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: loading || cart.length === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {loading ? "Processing..." : "🛒 Place Order"}
                  </button>

                  <div style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "#f9fafb",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <span>🔒</span>
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}