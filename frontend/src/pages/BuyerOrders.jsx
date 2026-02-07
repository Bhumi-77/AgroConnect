import { useEffect, useState } from "react";
import { api } from "../lib/api";

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

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      const { data } = await api.get("/api/orders/mine");
      setOrders(data.orders || []);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const payEsewa = async (orderId) => {
    try {
      // ✅ Use your backend route (adjust if your backend uses different)
     const { data } = await api.post(`/api/payments/esewa/initiate`, { orderId });

      if (!data.ok) throw new Error(data.error || "Esewa initiate failed");
      postToEsewa(data.formUrl, data.fields);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>My Orders</h2>
      {err && <div style={{ color: "red", marginBottom: 12 }}>{err}</div>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => {
            const canPayEsewa = o.paymentMethod === "ESEWA" && o.status !== "PAID";

            return (
              <div key={o.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
                <div><b>Order:</b> {o.id}</div>
                <div><b>Status:</b> {o.status}</div>
                <div><b>Payment:</b> {o.paymentMethod}</div>
                <div><b>Total:</b> Rs. {o.totalAmount}</div>

                <ul>
                  {(o.items || []).map((it) => (
                    <li key={it.id}>
                      {it.crop?.titleEn || it.crop?.titleNp || "Crop"} — {it.quantity} × Rs.{it.unitPrice}
                    </li>
                  ))}
                </ul>

                {canPayEsewa && (
                  <button onClick={() => payEsewa(o.id)}>
                    Pay with eSewa
                  </button>
                )}

                <button onClick={load} style={{ marginLeft: 8 }}>
                  Refresh
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
