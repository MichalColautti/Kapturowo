const nodemailer = require("nodemailer");
const { buildOrderConfirmationHtml } = require("../templates/orderConfirmationEmail");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mailpit",
  port: parseInt(process.env.SMTP_PORT || "1025", 10),
  secure: false, 
  auth: process.env.SMTP_USER && process.env.SMTP_PASSWORD ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  } : undefined, 
});

async function sendOrderConfirmationEmail({ to, orderId, totalPrice, items }) {
  const html = buildOrderConfirmationHtml({ orderId, totalPrice, items });

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL || "Kapturowo <noreply@kapturowo.pl>",
    to,
    subject: `Potwierdzenie zamówienia #${orderId}`,
    html,
  });
}

module.exports = { sendOrderConfirmationEmail };