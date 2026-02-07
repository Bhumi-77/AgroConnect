import { useSearchParams, Link } from "react-router-dom";

export default function PaymentFailure() {
  const [sp] = useSearchParams();

  // Support multiple possible parameter names from redirects
  const orderId =
    sp.get("orderId") ||
    sp.get("oid") ||
    sp.get("order_id") ||
    sp.get("transaction_uuid") ||
    "";

  const reason =
    sp.get("reason") ||
    sp.get("message") ||
    sp.get("error") ||
    sp.get("status") ||
    "";

  return (
    <div style={{ padding: 16 }}>
      <h2>Payment Failed ❌</h2>

      <p>Order: {orderId || "-"}</p>
      <p>Reason: {reason || "Payment not completed"}</p>

      {/* Your app route is /buyer/orders (NOT /orders) */}
      <Link to="/buyer/orders">Back to Orders</Link>
    </div>
  );
}
