import nodemailer from "nodemailer";
import { formatPrice, BRAND, SOCIALS } from "./constants";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
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
  const orderIdShort = order.id.slice(0, 8).toUpperCase();

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
            <h1>Thank You for Your Order!</h1>
            <p>Order #${orderIdShort} has been successfully placed.</p>
            <p>${isCOD ? "Our team will contact you shortly to coordinate payment and delivery." : "Your payment has been verified. We are now preparing your order for shipment."}</p>
          </div>

          <div class="order-details">
            <h2>Order Summary</h2>
            ${items
              .map(
                (item) => `
              <div class="item-row">
                <div class="item-info">
                  <div>${item.product_name}</div>
                  <span>Size: ${item.size} &times; ${item.quantity}</span>
                </div>
                <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
              </div>
            `,
              )
              .join("")}
            
            <div class="summary">
              <div class="summary-row">
                <div class="summary-label">Subtotal</div>
                <div class="summary-value">${formatPrice(order.total_amount)}</div>
              </div>
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
            <p><strong>Payment Method:</strong> ${order.payment_method.toUpperCase()}</p>
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
      subject: `Order Confirmation #${orderIdShort} - Elita Apparel`,
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
