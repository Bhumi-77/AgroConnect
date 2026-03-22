import crypto from "crypto";

export function buildEsewaMessage(data, signedFieldNames) {
  return signedFieldNames
    .split(",")
    .map(field => `${field}=${data[field]}`)
    .join(",");
}

export function signEsewaMessage(message, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");
}

export function decodeEsewaData(base64String) {
  const json = Buffer.from(base64String, "base64").toString("utf-8");
  return JSON.parse(json);
}

export function verifyEsewaResponseSignature(decodedData, secret) {
  const { signature, signed_field_names } = decodedData;

  const message = signed_field_names
    .split(",")
    .map(field => `${field}=${decodedData[field]}`)
    .join(",");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");

  return expected === signature;
}