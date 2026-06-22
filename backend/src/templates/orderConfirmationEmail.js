function formatPrice(amount) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount);
}

function buildOrderConfirmationHtml({ orderId, totalPrice }) {
  const formattedTotal = formatPrice(totalPrice);

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potwierdzenie zamówienia</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1a1a2e;padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">Kapturowo</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;">Dziękujemy za zakupy!</h2>
              <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                Twoje zamówienie zostało przyjęte i jest w trakcie realizacji. Poniżej znajdziesz podsumowanie.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:6px;padding:20px;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Numer zamówienia</td>
                  <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;text-align:right;">#${orderId}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Łączna kwota</td>
                  <td style="padding:8px 0;color:#1a1a2e;font-size:14px;font-weight:600;text-align:right;">${formattedTotal}</td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:#4b5563;font-size:14px;line-height:1.6;">
                W razie pytań skontaktuj się z nami. Do zobaczenia w Kapturowo!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                &copy; Kapturowo &mdash; wiadomość wygenerowana automatycznie, prosimy na nią nie odpowiadać.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { buildOrderConfirmationHtml };
