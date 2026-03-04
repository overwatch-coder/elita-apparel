import { BRAND, SOCIALS } from "@/lib/constants";

export interface ProductData {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
}

export type EmailBlock =
  | { type: "header" }
  | { type: "hero"; imageUrl: string; title: string; subtitle?: string }
  | { type: "text"; content: string }
  | { type: "product_grid"; productIds: string[]; products?: ProductData[] }
  | { type: "cta"; label: string; url: string }
  | { type: "divider" }
  | { type: "socials" };

export function generateCampaignHtml(blocks: EmailBlock[]) {
  const content = blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `
          <div style="padding: 30px 20px; text-align: center;">
            <a href="${BRAND.siteUrl}" style="text-decoration: none;">
              <span style="font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 2px; text-transform: uppercase;">${BRAND.name}</span>
            </a>
          </div>
        `;
        case "hero":
          return `
          <div style="padding: 0; position: relative; text-align: center; background-color: #f9f9f9;">
            <a href="${BRAND.siteUrl}/shop">
              <img src="${block.imageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"}" alt="${block.title}" style="width: 100%; height: auto; max-height: 400px; object-fit: cover; display: block;" />
            </a>
            <div style="padding: 40px 20px;">
              <h1 style="font-family: 'serif', Georgia, serif; font-size: 32px; margin: 0; color: #1a1a1a; line-height: 1.2;">${block.title}</h1>
              ${block.subtitle ? `<p style="font-size: 18px; color: #666; margin-top: 15px; margin-bottom: 0;">${block.subtitle}</p>` : ""}
            </div>
          </div>
        `;
        case "text":
          return `
          <div style="padding: 20px 40px; font-size: 16px; line-height: 1.6; color: #333; text-align: left;">
            ${block.content
              .split("\n")
              .filter((p) => p.trim() !== "")
              .map((p) => `<p style="margin-bottom: 15px;">${p}</p>`)
              .join("")}
          </div>
        `;
        case "cta":
          return `
          <div style="padding: 30px 20px; text-align: center;">
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${block.url}" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="#C6A75E">
              <w:anchorlock/>
              <center>
            <![endif]-->
            <a href="${block.url}" style="background-color: #C6A75E; color: white; display: inline-block; padding: 18px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">
              ${block.label}
            </a>
            <!--[if mso]>
              </center>
            </v:roundrect>
            <![endif]-->
          </div>
        `;
        case "divider":
          return `<div style="padding: 10px 40px;"><hr style="border: 0; border-top: 1px solid #eee;" /></div>`;
        case "socials":
          return `
          <div style="padding: 40px 20px; text-align: center; background-color: #fafafa; border-top: 1px solid #eee;">
            <p style="font-size: 11px; color: #999; margin: 0 0 20px 0; letter-spacing: 2px; text-transform: uppercase;">FOLLOW OUR JOURNEY</p>
            <div style="margin-bottom: 20px;">
              <a href="${SOCIALS.instagram.url}" style="text-decoration: none; color: #1a1a1a; margin: 0 10px; font-size: 14px;">Instagram</a>
              <a href="${SOCIALS.whatsapp.url}" style="text-decoration: none; color: #1a1a1a; margin: 0 10px; font-size: 14px;">WhatsApp</a>
              <a href="${SOCIALS.tiktok.url}" style="text-decoration: none; color: #1a1a1a; margin: 0 10px; font-size: 14px;">TikTok</a>
            </div>
          </div>
        `;
        case "product_grid":
          const products = block.products || [];
          if (products.length === 0) {
            return `
              <div style="padding: 20px 40px; text-align: center; color: #999; font-size: 14px; border: 1px dashed #eee; margin: 0 40px;">
                <p>[Product Grid Placeholder: Select products in the editor]</p>
              </div>
            `;
          }

          const productHtml = products
            .map(
              (product) => `
            <div class="col-6" style="display: inline-block; width: 48%; vertical-align: top; margin-bottom: 25px; text-align: center;">
              <a href="${BRAND.siteUrl}/product/${product.slug}" style="text-decoration: none; color: #1a1a1a;">
                <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: auto; border-radius: 4px; display: block; margin-bottom: 10px;" />
                <p style="margin: 0; font-size: 14px; font-weight: bold;">${product.name}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #C6A75E; font-weight: bold;">GH₵${product.price.toFixed(2)}</p>
              </a>
            </div>
          `,
            )
            .join(' <div style="display: inline-block; width: 3%;"></div> ');

          return `
            <div style="padding: 20px 40px; text-align: center;">
              ${productHtml}
            </div>
          `;
        default:
          return "";
      }
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
        <!--<![endif]-->
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          h1, h2, .font-serif { font-family: 'Playfair Display', 'Times New Roman', Georgia, serif; }
          p { margin: 0; }
          img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
          table { border-collapse: collapse !important; }
          
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .col-6 { width: 100% !important; display: block !important; margin-bottom: 30px !important; }
          }
        </style>
      </head>
      <body style="background-color: #ffffff;">
        <div class="container">
          ${content}
          
          <div style="padding: 60px 20px; text-align: center; font-size: 11px; color: #999; line-height: 1.5; background-color: #fafafa;">
            <p style="text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">${BRAND.name}</p>
            <p>${BRAND.location}</p>
            <p style="margin-top: 30px;">
              You received this email because you subscribed to our newsletter via our store. 
              We're honored to have you on our journey.
            </p>
            <p style="margin-top: 15px;">
              <a href="${BRAND.siteUrl}/unsubscribe?email={{EMAIL}}" style="color: #666; text-decoration: underline;">Unsubscribe</a> 
              &bull; 
              <a href="${BRAND.siteUrl}/shop" style="color: #666; text-decoration: underline;">View Shop</a>
            </p>
            <p style="margin-top: 40px;">&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
