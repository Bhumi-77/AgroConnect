const crypto = require("crypto");

function generateEsewaSignature(secret, message) {
  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");
}

// ✅ Correct message format
const message = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${productCode}`;
const signature = generateEsewaSignature(process.env.ESEWA_SECRET, message);