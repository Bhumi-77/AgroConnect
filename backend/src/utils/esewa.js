import crypto from "crypto";

// Build signing message in the exact order of signed_field_names
export function buildEsewaMessage(fields, signedFieldNames) {
  const keys = signedFieldNames.split(",").map((s) => s.trim());
  return keys.map((k) => `${k}=${fields[k]}`).join(",");
}

// HMAC-SHA256 + base64
export function signEsewaMessage(message, secret) {
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
}

// eSewa sends base64 JSON in query param "data"
export function decodeEsewaData(dataBase64) {
  const json = Buffer.from(dataBase64, "base64").toString("utf-8");
  return JSON.parse(json);
}

// Verify callback signature using signed_field_names + signature fields
export function verifyEsewaResponseSignature(decodedBody, secret) {
  const signedFieldNames = decodedBody.signed_field_names;
  const msg = buildEsewaMessage(decodedBody, signedFieldNames);
  const expected = signEsewaMessage(msg, secret);
  return expected === decodedBody.signature;
}
