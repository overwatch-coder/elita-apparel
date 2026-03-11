import nodemailer from "nodemailer";
import { formatPrice, BRAND, SOCIALS } from "./constants";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: parseInt(process.env.SMTP_PORT || "587") === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmation(order: any, items: any[]) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      "SMTP credentials are not set. Skipping order confirmation email.",
    );
    return { error: "Email configuration missing" };
  }

  const isCOD = order.payment_method === "cod";
  const isVerified =
    order.payment_status === "paid" ||
    order.payment_status === "verified" ||
    order.payment_status === "success";

  const trackingNumber =
    order.tracking_number || order.id.slice(0, 8).toUpperCase();

  let statusMessage = "";
  if (isCOD) {
    statusMessage =
      "Our team will contact you shortly to coordinate payment and delivery.";
  } else if (isVerified) {
    statusMessage =
      "Your payment has been verified. We are now preparing your order for shipment.";
  } else {
    statusMessage =
      "We have received your order. If you've chosen to pay via Card or Mobile Money, your order will be processed as soon as we verify your payment.";
  }

  const subjectHeader = isVerified
    ? `Payment Verified - Order #${trackingNumber}`
    : `Order Confirmation #${trackingNumber}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'serif', 'Georgia', serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f9f9f9; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 40px; border: 1px solid #e5e5e5; }
          .header { text-align: center; border-bottom: 2px solid #cab083; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #1a1a1a; text-transform: uppercase; letter-spacing: 2px; }
          .hero { text-align: center; margin-bottom: 40px; }
          .hero h1 { font-size: 24px; margin-bottom: 10px; color: #1a1a1a; }
          .hero p { color: #666666; font-size: 16px; }
          .order-details { margin-bottom: 40px; }
          .order-details h2 { font-size: 18px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px; }
          .item-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px; }
          .item-info { flex: 1; }
          .item-info span { color: #888888; font-size: 12px; }
          .item-price { font-weight: bold; }
          .summary { border-top: 2px solid #f1f1f1; padding-top: 20px; text-align: right; }
          .summary-row { display: flex; justify-content: flex-end; margin-bottom: 5px; }
          .summary-label { color: #666666; padding-right: 20px; font-size: 14px; }
          .summary-value { font-weight: bold; font-size: 16px; }
          .total-row { margin-top: 10px; font-size: 18px; color: #cab083; }
          .shipping { background: #fdfaf5; padding: 20px; border-radius: 8px; margin-bottom: 40px; font-size: 14px; }
          .shipping h3 { font-size: 16px; margin-bottom: 10px; }
          .footer { text-align: center; font-size: 12px; color: #999999; margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px; }
          .social-links { margin-bottom: 20px; }
          .social-links a { margin: 0 10px; color: #cab083; text-decoration: none; }
          .button { display: inline-block; padding: 12px 24px; background-color: #cab083; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">${BRAND.name}</div>
            <div style="font-size: 12px; color: #cab083; margin-top: 5px;">${BRAND.tagline}</div>
          </div>
          
          <div class="hero">
            <h1>${isVerified ? "Payment Verified!" : "Thank You for Your Order!"}</h1>
            <p>Order #${trackingNumber} has been successfully ${isVerified ? "verified" : "placed"}.</p>
            <p>${statusMessage}</p>
          </div>

          <div class="order-details">
            <h2>Order Summary</h2>
            ${items
              .map(
                (item) => `
              <div class="item-row">
                <div class="item-info">
                  <div>${item.product_name}</div>
                  <span>Size: ${item.size}${item.color ? ` &bull; Color: ${item.color}` : ""} &times; ${item.quantity}</span>
                </div>
                <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
              </div>
            `,
              )
              .join("")}
            
            <div class="summary">
              <div class="summary-row">
                <div class="summary-label">Subtotal</div>
                <div class="summary-value">${formatPrice(order.total_amount + (order.discount_amount || 0))}</div>
              </div>
              ${
                order.discount_amount > 0
                  ? `
              <div class="summary-row">
                <div class="summary-label" style="color: #2e7d32;">Discount</div>
                <div class="summary-value" style="color: #2e7d32;">-${formatPrice(order.discount_amount)}</div>
              </div>`
                  : ""
              }
              <div class="summary-row">
                <div class="summary-label">Shipping</div>
                <div class="summary-value">Calculated at delivery</div>
              </div>
              <div class="summary-row total-row">
                <div class="summary-label" style="color: #cab083;">Total</div>
                <div class="summary-value">${formatPrice(order.total_amount)}</div>
              </div>
            </div>
          </div>

          <div class="shipping">
            <h3>Shipping Details</h3>
            <p>${order.customer_name}<br>
            ${order.shipping_address}<br>
            ${order.shipping_city}, ${order.shipping_state || ""}<br>
            ${order.shipping_country}</p>
          </div>

          <div style="text-align: center;">
            <a href="${BRAND.siteUrl}/account/orders/${order.id}" class="button">View Order Status</a>
          </div>

          <div class="footer">
            <div class="social-links">
              <a href="${SOCIALS.instagram.url}">Instagram</a>
              <a href="${SOCIALS.whatsapp.url}">WhatsApp</a>
            </div>
            <p>&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
            <p>${BRAND.location}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM || `"Elita Apparel" <${process.env.SMTP_USER}>`,
      to: order.customer_email,
      subject: `${subjectHeader} - Elita Apparel`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      "Error sending order confirmation email via Nodemailer:",
      error,
    );
    return { error: "Failed to send email" };
  }
}
export async function sendVerificationCodeEmail(
  email: string,
  code: string,
  type: "email_change" | "password_change",
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing. Logging OTP to console:", code);
    return { success: true };
  }

  const typeLabel =
    type === "email_change" ? "Email Address Change" : "Password Change";
  const actionText =
    type === "email_change" ? "updating your email" : "changing your password";

  const emailHtml = `
    <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e5e5;">
      <h2 style="text-align: center; border-bottom: 2px solid #cab083; padding-bottom: 20px;">Verification Code</h2>
      <p>Hello,</p>
      <p>You recently requested to securely ${actionText} on your Elita Apparel account.</p>
      <div style="background: #fdfaf5; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #cab083;">${code}</span>
      </div>
      <p>This code will expire in 10 minutes. If you did not make this request, please ignore this email or contact support if you have concerns.</p>
      <p style="margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 12px; color: #999999; text-align: center;">
        &copy; ${new Date().getFullYear()} Elita Apparel. All rights reserved.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from:
        process.env.SMTP_FROM || `"Elita Apparel" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Verification Code - ${typeLabel}`,
      html: emailHtml,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending verification code email:", error);
    return { error: "Failed to send verification code" };
  }
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string,
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing. Reset link:", resetLink);
    return { success: true };
  }

  const year = new Date().getFullYear();

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background-color:#0c0a09;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ececec;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0c0a09;padding:40px 0;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#14110f;border:1px solid #c29b62;border-radius:8px;overflow:hidden;margin:0 auto;">
        <tr>
          <td align="center" style="padding:40px 20px 20px;background-color:#1a1614;border-bottom:2px solid #33291a;">
            <h1 style="margin:0;font-size:28px;color:#c29b62;letter-spacing:2px;font-weight:normal;text-transform:uppercase;">ELITA APPAREL</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 30px;">
            <h2 style="margin:0 0 20px 0;font-size:22px;color:#ffffff;font-weight:500;">Reset Your Password</h2>
            <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#a1a1aa;">Hello,</p>
            <p style="margin:0 0 30px 0;font-size:16px;line-height:1.6;color:#a1a1aa;">We received a request to reset the password for your Elita Apparel account. Click the button below to set a new password.</p>
            <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
              <tr>
                <td align="center" style="border-radius:4px;background-color:#c29b62;">
                  <a href="${resetLink}" target="_blank" style="font-size:16px;font-family:Helvetica,Arial,sans-serif;color:#000000;text-decoration:none;border-radius:4px;padding:14px 28px;border:1px solid #c29b62;display:inline-block;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">
                    Reset Password
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:30px 0 0 0;font-size:12px;line-height:1.6;color:#71717a;word-break:break-all;">Or copy this link: <a href="${resetLink}" style="color:#c29b62;">${resetLink}</a></p>
            <p style="margin:20px 0 0 0;font-size:14px;line-height:1.6;color:#a1a1aa;">This link expires in 1 hour. If you did not request a reset, you can safely ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:30px;background-color:#0c0a09;border-top:1px solid #33291a;">
            <p style="margin:0 0 10px 0;font-size:13px;color:#71717a;">&copy; ${year} Elita Apparel. All rights reserved.</p>
            <p style="margin:0;font-size:12px;color:#71717a;">Accra, Ghana</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from:
        process.env.SMTP_FROM || `"Elita Apparel" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Reset your Elita Apparel password",
      html: emailHtml,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { error: "Failed to send email" };
  }
}
