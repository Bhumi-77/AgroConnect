import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0fdf4",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#16a34a", marginBottom: "16px" }}>
          Payment Successful ✅
        </h2>

        <p style={{ marginBottom: "10px", fontSize: "16px" }}>
          <strong>Order ID:</strong> {orderId || "-"}
        </p>

        {ref ? (
          <p style={{ marginBottom: "20px", fontSize: "16px" }}>
            <strong>Reference:</strong> {ref}
          </p>
        ) : null}

        <p style={{ color: "#555", marginBottom: "24px" }}>
          Thank you for your purchase! Your payment has been completed successfully.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/buyer/orders")}
            style={{
              padding: "12px 18px",
              backgroundColor: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Go to My Orders
          </button>

          <button
            onClick={() => navigate("/market")}
            style={{
              padding: "12px 18px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}