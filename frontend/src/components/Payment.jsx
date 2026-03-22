import React, { useState } from "react";
import axios from "axios";
import { generateUniqueId } from "esewajs";

const PaymentComponent = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/initiate-payment",
        {
          amount,
          productId: generateUniqueId(),
        }
      );

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error initiating payment:", error);
      setError("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>eSewa Payment Integration</h1>

      <div className="form-container">
        <form className="styled-form" onSubmit={handlePayment}> {/* ✅ fixed */}
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Processing..." : "Pay with eSewa"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;