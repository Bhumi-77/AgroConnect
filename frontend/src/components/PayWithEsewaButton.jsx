import { useState } from "react";
import api from "../lib/api"; // your axios instance path

export default function PayWithEsewaButton({ orderId }) {
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/payments/esewa/initiate", { orderId });

      if (!data?.ok) throw new Error(data?.message || "eSewa initiate failed");

      // Create + submit form to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.formUrl;

      Object.entries(data.fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={pay} disabled={loading}>
      {loading ? "Redirecting..." : "Pay with eSewa"}
    </button>
  );
}
