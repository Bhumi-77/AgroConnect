import { PrismaClient } from "@prisma/client";
import {
  buildEsewaMessage,
  signEsewaMessage,
  decodeEsewaData,
  verifyEsewaResponseSignature,
} from "../utils/esewa.js";

const prisma = new PrismaClient();

// POST /api/payments/esewa/initiate
const initiateEsewa = async (req, res) => {
  const { orderId } = req.body;
  const buyerId = req.user?.id;

  try {
    if (!orderId || !buyerId) {
      return res
        .status(400)
        .json({ message: "Missing orderId or authentication" });
    }

    // Fetch order with amount
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyerId !== buyerId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Create or update Payment record
    let payment = await prisma.payment.findUnique({
      where: { orderId: orderId },
    });

    if (payment) {
      // If payment already exists and succeeded, don't allow re-payment
      if (payment.status === "success") {
        return res.status(400).json({
          message: "Order already paid",
          status: payment.status,
        });
      }
      // If payment exists but failed/initiated, we can re-initiate
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "initiated", ref: `${orderId}-${Date.now()}` },
      });
    } else {
      // Create new payment
      payment = await prisma.payment.create({
        data: {
          orderId: orderId,
          method: "ESEWA",
          status: "initiated",
          ref: `${orderId}-${Date.now()}`,
        },
      });
    }

    // Build eSewa request data
    const totalAmount = parseFloat(order.totalAmount).toFixed(2);

    const esewaData = {
      amount: totalAmount,
      failure_url: `${process.env.FRONTEND_URL}/payment-failure`,
      product_code: process.env.ESEWA_PRODUCT_CODE,
      product_delivery_charge: "0",
      product_service_charge: "0",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: `${process.env.BACKEND_URL}/api/payments/esewa/success`,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: payment.ref,
    };

    // Sign the message
    const message = buildEsewaMessage(esewaData, esewaData.signed_field_names);
    const signature = signEsewaMessage(message, process.env.ESEWA_SECRET);

    return res.status(200).json({
      ok: true,
      formUrl: process.env.ESEWA_PAYMENT_URL,
      fields: {
        ...esewaData,
        signature,
        merchant_code: process.env.ESEWA_MERCHANT_CODE,
      },
    });

  } catch (error) {
    console.error("initiateEsewa error:", error);
    return res
      .status(500)
      .json({ message: "Error initiating payment", error: error.message });
  }
};

// GET /api/payments/esewa/success
const esewaSuccess = async (req, res) => {
  const { data: dataBase64 } = req.query;

  try {
    if (!dataBase64) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    // Decode eSewa response
    const decodedData = decodeEsewaData(dataBase64);

    // Verify signature
    const isValid = verifyEsewaResponseSignature(
      decodedData,
      process.env.ESEWA_SECRET
    );
    if (!isValid) {
      console.warn("⚠️ Invalid eSewa signature - possible tampering");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const transactionUuid = decodedData.transaction_uuid;

    // Find payment by reference
    const payment = await prisma.payment.findFirst({
      where: { ref: transactionUuid },
      include: { order: true },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Verify amount matches
    if (parseFloat(decodedData.total_amount) !== payment.order.totalAmount) {
      console.warn("⚠️ Amount mismatch");
      return res.status(400).json({ message: "Amount mismatch" });
    }

    // Update payment status to success
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "success" },
    });

    // Update order status to PAID
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });

    console.log("✅ Payment verified for order:", payment.orderId);

    // Redirect to frontend success page
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-success?orderId=${payment.orderId}&ref=${transactionUuid}`
    );

  } catch (error) {
    console.error("esewaSuccess error:", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failure?error=verification_failed`
    );
  }
};

// GET /api/payments/esewa/failure
const esewaFailure = async (req, res) => {
  const { data: dataBase64 } = req.query;

  try {
    let transactionUuid = null;

    if (dataBase64) {
      const decodedData = decodeEsewaData(dataBase64);
      transactionUuid = decodedData.transaction_uuid;

      // Find payment and mark as failed
      const payment = await prisma.payment.findFirst({
        where: { ref: transactionUuid },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "failed" },
        });
        console.log("❌ Payment failed for ref:", transactionUuid);
      }
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failure?ref=${transactionUuid || "unknown"}`
    );

  } catch (error) {
    console.error("esewaFailure error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
};

export { initiateEsewa, esewaSuccess, esewaFailure };