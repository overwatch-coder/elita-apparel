import { BRAND, SOCIALS } from "@/lib/constants";

export type EmailBlock =
  | { type: "header" }
  | { type: "hero"; imageUrl: string; title: string; subtitle?: string }
  | { type: "text"; content: string }
  | { type: "product_grid"; productIds: string[] }
  | { type: "cta"; label: string; url: string }
  | { type: "divider" }
  | { type: "socials" };

export function generateCampaignHtml(blocks: EmailBlock[]) {
  const content = blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `
          <div style="padding: 20px; text-align: center;">
            <img src="${BRAND.siteUrl}/logo.png" alt="${BRAND.name}" style="height: 50px; width: auto;" />
          </div>
        `;
        case "hero":
          return `
          <div style="padding: 0; position: relative; text-align: center; background-color: #f9f9f9;">
            <img src="${block.imageUrl}" alt="${block.title}" style="width: 100%; height: auto; max-height: 400px; object-fit: cover;" />
            <div style="padding: 30px 20px;">
              <h1 style="font-family: 'serif'; font-size: 28px; margin: 0; color: #1a1a1a;">${block.title}</h1>
              ${block.subtitle ? `<p style="font-size: 16px; color: #666; margin-top: 10px;">${block.subtitle}</p>` : ""}
            </div>
          </div>
        `;
        case "text":
          return `
          <div style="padding: 20px; font-size: 16px; line-height: 1.6; color: #333;">
            ${block.content
              .split("\n")
              .map((p) => `<p>${p}</p>`)
              .join("")}
          </div>
        `;
        case "cta":
          return `
          <div style="padding: 30px 20px; text-align: center;">
            <a href="${block.url}" style="background-color: #C6A75E; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 14px;">
              ${block.label}
            </a>
          </div>
        `;
        case "divider":
          return `<div style="padding: 10px 0;"><hr style="border: 0; border-top: 1px solid #eee;" /></div>`;
        case "socials":
          return `
          <div style="padding: 20px; text-align: center; background-color: #fafafa;">
            <p style="font-size: 12px; color: #999; margin-bottom: 20px;">FOLLOW US</p>
            <div style="display: flex; justify-content: center; gap: 15px;">
              <a href="${SOCIALS.instagram.url}" style="text-decoration: none; color: #1a1a1a;">Instagram</a>
              <a href="${SOCIALS.whatsapp.url}" style="text-decoration: none; color: #1a1a1a;">WhatsApp</a>
              <a href="${SOCIALS.tiktok.url}" style="text-decoration: none; color: #1a1a1a;">TikTok</a>
            </div>
          </div>
        `;
        case "product_grid":
          // For MVP, we'll just show a placeholder grid.
          // In a real implementation, we would fetch product data and render images/prices.
          return `
          <div style="padding: 20px; display: grid; grid-template-cols: 1fr 1fr; gap: 20px;">
            <p style="grid-column: 1 / -1; text-align: center; color: #666; font-size: 14px;">[Featured Collection Grid]</p>
          </div>
        `;
        default:
          return "";
      }
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; margin: 0; padding: 0; background-color: #fff; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #eee; }
          @font-face {
            font-family: 'serif';
            src: local('Times New Roman'), local('Georgia');
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
          <div style="padding: 40px 20px; text-align: center; font-size: 12px; color: #999;">
            <p>${BRAND.name} | ${BRAND.location}</p>
            <p style="margin-top: 10px;">
              You received this email because you subscribed to our newsletter.
              <br />
              <a href="${BRAND.siteUrl}/unsubscribe?email={{EMAIL}}" style="color: #666; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
