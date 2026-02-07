import prisma from "../../prisma/prisma.js";

import axios from "axios";
import {
  buildEsewaMessage,
  signEsewaMessage,
  decodeEsewaData,
  verifyEsewaResponseSignature,
} from "../utils/esewa.js";

function mustHaveEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

// POST /api/payments/esewa/initiate  (auth required)
export async function initiateEsewa(req, res) {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ ok: false, message: "orderId required" });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) return res.status(404).json({ ok: false, message: "Order not found" });

    // only buyer can pay their order
    if (order.buyerId !== req.user.id) {
      return res.status(403).json({ ok: false, message: "Not your order" });
    }

    if (order.paymentMethod !== "ESEWA") {
      return res.status(400).json({ ok: false, message: "Order is not ESEWA payment method" });
    }

    if (order.status === "PAID") {
      return res.status(400).json({ ok: false, message: "Order already paid" });
    }

    const product_code = mustHaveEnv("ESEWA_PRODUCT_CODE");
    const secret = mustHaveEnv("ESEWA_SECRET_KEY");
    const formUrl = mustHaveEnv("ESEWA_FORM_URL");
    const backendUrl = mustHaveEnv("BACKEND_URL");

    // eSewa requires: amount, tax_amount, total_amount, transaction_uuid, product_code, charges, success/failure_url + signature :contentReference[oaicite:6]{index=6}
    const amount = Number(order.totalAmount);
    const tax_amount = 0;
    const product_service_charge = 0;
    const product_delivery_charge = 0;
    const total_amount = amount + tax_amount + product_service_charge + product_delivery_charge;

    // transaction_uuid must be unique; supports alphanumeric and hyphen :contentReference[oaicite:7]{index=7}
    const transaction_uuid = `ORD-${order.id}-${Date.now()}`;

    // create/update payment record
    const payment = order.payment
      ? await prisma.payment.update({
          where: { orderId: order.id },
          data: { method: "ESEWA", status: "initiated", ref: transaction_uuid },
        })
      : await prisma.payment.create({
          data: { orderId: order.id, method: "ESEWA", status: "initiated", ref: transaction_uuid },
        });

    const signed_field_names = "total_amount,transaction_uuid,product_code";
    const fieldsToSign = {
      total_amount: total_amount.toString(),
      transaction_uuid,
      product_code,
    };
    const message = buildEsewaMessage(fieldsToSign, signed_field_names);
    const signature = signEsewaMessage(message, secret);

    // success/failure: eSewa redirects back with Base64-encoded response body (query param often 'data') :contentReference[oaicite:8]{index=8}
    const success_url = `${backendUrl}/api/payments/esewa/success?orderId=${order.id}`;
    const failure_url = `${backendUrl}/api/payments/esewa/failure?orderId=${order.id}`;

    return res.json({
      ok: true,
      formUrl,
      fields: {
        amount: amount.toString(),
        tax_amount: tax_amount.toString(),
        total_amount: total_amount.toString(),
        transaction_uuid,
        product_code,
        product_service_charge: product_service_charge.toString(),
        product_delivery_charge: product_delivery_charge.toString(),
        success_url,
        failure_url,
        signed_field_names,
        signature,
      },
      paymentId: payment.id,
      orderId: order.id,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: e.message || "initiateEsewa failed" });
  }
}

// GET /api/payments/esewa/success?orderId=...&data=...
export async function esewaSuccess(req, res) {
  try {
    const { orderId, data } = req.query;
    if (!orderId || !data) return res.status(400).send("Missing orderId/data");

    const secret = mustHaveEnv("ESEWA_SECRET_KEY");
    const statusUrl = mustHaveEnv("ESEWA_STATUS_URL");
    const product_code = mustHaveEnv("ESEWA_PRODUCT_CODE");
    const frontend = mustHaveEnv("FRONTEND_URL");

    const decoded = decodeEsewaData(data);

    // Verify signature integrity :contentReference[oaicite:9]{index=9}
    const okSig = verifyEsewaResponseSignature(decoded, secret);
    if (!okSig) {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: "failed" },
      });
      return res.redirect(`${frontend}/payment/failure?orderId=${orderId}&reason=bad_signature`);
    }

    // decoded.status expected COMPLETE for success :contentReference[oaicite:10]{index=10}
    if (decoded.status !== "COMPLETE") {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: decoded.status?.toLowerCase?.() || "failed" },
      });
      return res.redirect(`${frontend}/payment/failure?orderId=${orderId}&reason=${decoded.status}`);
    }

    // Optional: Verify with status check API (recommended when needed) :contentReference[oaicite:11]{index=11}
    // We'll still do it for extra safety:
    const total_amount = decoded.total_amount;
    const transaction_uuid = decoded.transaction_uuid;

    const verifyUrl =
      `${statusUrl}?product_code=${encodeURIComponent(product_code)}` +
      `&total_amount=${encodeURIComponent(total_amount)}` +
      `&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;

    const statusResp = await axios.get(verifyUrl, { timeout: 10000 });
    const verifyStatus = statusResp.data?.status;

    if (verifyStatus !== "COMPLETE") {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: "failed" },
      });
      return res.redirect(`${frontend}/payment/failure?orderId=${orderId}&reason=status_${verifyStatus}`);
    }

    // Mark order paid
    await prisma.payment.updateMany({
      where: { orderId },
      data: {
        status: "success",
        ref: decoded.transaction_code || decoded.transaction_uuid,
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    return res.redirect(`${frontend}/payment/success?orderId=${orderId}`);
  } catch (e) {
    console.error(e);
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const orderId = req.query.orderId || "";
    return res.redirect(`${frontend}/payment/failure?orderId=${orderId}&reason=server_error`);
  }
}

// GET /api/payments/esewa/failure?orderId=...
export async function esewaFailure(req, res) {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  const orderId = req.query.orderId || "";

  await prisma.payment.updateMany({
    where: { orderId },
    data: { status: "failed" },
  });

  return res.redirect(`${frontend}/payment/failure?orderId=${orderId}&reason=cancel_or_failed`);
}
