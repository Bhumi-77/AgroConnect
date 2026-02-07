import { useSearchParams, Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [sp] = useSearchParams();

  // Support multiple possible parameter names from redirects
  const orderId =
    sp.get("orderId") ||
    sp.get("oid") ||
    sp.get("order_id") ||
    sp.get("transaction_uuid") ||
    "";

  const ref =
    sp.get("ref") ||
    sp.get("refId") ||
    sp.get("ref_id") ||
    sp.get("token") ||
    "";

  return (
    <div style={{ padding: 16 }}>
      <h2>Payment Successful ✅</h2>

      <p>Order: {orderId || "-"}</p>
      {ref ? <p>Reference: {ref}</p> : null}

      {/* Your app route is /buyer/orders (NOT /orders) */}
      <Link to="/buyer/orders">Go to My Orders</Link>
    </div>
  );
}
