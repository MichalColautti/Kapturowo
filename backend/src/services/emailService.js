const nodemailer = require("nodemailer");
const { buildOrderConfirmationHtml } = require("../templates/orderConfirmationEmail");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "mailpit",
  port: parseInt(process.env.EMAIL_PORT || "1025", 10),
  secure: false,
});

async function sendOrderConfirmationEmail({ to, orderId, totalPrice }) {
  const html = buildOrderConfirmationHtml({ orderId, totalPrice });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "Kapturowo <noreply@kapturowo.pl>",
    to,
    subject: `Potwierdzenie zamówienia #${orderId}`,
    html,
  });
}

module.exports = { sendOrderConfirmationEmail };
