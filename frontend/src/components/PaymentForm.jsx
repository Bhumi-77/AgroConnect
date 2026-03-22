export default function PaymentForm() {
  const [showSecret, setShowSecret] = React.useState(false);
  
  const message = "Message";
  const secret = "secret";

  const hash = CryptoJS.HmacSHA256(message, secret);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return (
    <div>
      <h2>CryptoJS HMAC SHA256 Example</h2>
      <p><strong>Message:</strong> {message}</p>
      <p>
        <strong>Secret:</strong>{" "}
        {showSecret ? secret : "••••••"}
        <button onClick={() => setShowSecret(!showSecret)}>
          {showSecret ? "Hide" : "Show"}
        </button>
      </p>
      <p><strong>Hash (Base64):</strong> {hashInBase64}</p>
    </div>
  );
}