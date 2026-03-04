import { CartItem } from "./types/database";
import { SOCIALS } from "./constants";

export function generateOrderRef(): string {
  const randomShortId = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
  return `ELITA-${randomShortId}`;
}

export function encodeWhatsAppUrl(message: string): string {
  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    SOCIALS.whatsapp.number.replace("+", "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedText}`;
}

export interface SingleProductWhatsApp {
  productName: string;
  price: number;
  size?: string;
  url: string;
  orderRef: string;
  customerName?: string;
  customerPhone?: string;
}

export function generateSingleProductMessage(
  data: SingleProductWhatsApp,
): string {
  let message = `Hello Elita Apparel 👋🏾\n\nI would like to order the following item:\n\n`;
  message += `Product: ${data.productName}\n`;
  message += `Price: ${data.price.toFixed(2)} GHS\n`;
  if (data.size) message += `Size: ${data.size}\n`;
  message += `Product Link: ${data.url}\n\n`;
  message += `Order Ref: ${data.orderRef}\n\n`;

  if (data.customerName) message += `Customer Name: ${data.customerName}\n`;
  if (data.customerPhone) message += `Phone: ${data.customerPhone}\n`;
  if (data.customerName || data.customerPhone) message += `\n`;

  message += `Kindly confirm availability and next steps.\n\nThank you 🤍`;

  return message;
}

export interface CartWhatsApp {
  items: CartItem[];
  totalAmount: number;
  orderRef: string;
  customerName?: string;
  customerPhone?: string;
}

export function generateCartMessage(data: CartWhatsApp): string {
  let message = `Hello Elita Apparel 👋🏾\n\nI would like to place an order for:\n\n`;

  data.items.forEach((item, index) => {
    message += `Item ${index + 1}\n`;
    message += `- Product: ${item.name}\n`;
    message += `- Size: ${item.size}\n`;
    message += `- Quantity: ${item.quantity}\n`;
    message += `- Price: ${item.price.toFixed(2)} GHS\n\n`;
  });

  message += `Order Total: ${data.totalAmount.toFixed(2)} GHS\n`;
  message += `Order Ref: ${data.orderRef}\n\n`;

  if (data.customerName) message += `Customer Name: ${data.customerName}\n`;
  if (data.customerPhone) message += `Phone: ${data.customerPhone}\n`;
  if (data.customerName || data.customerPhone) message += `\n`;

  message += `Please confirm availability and delivery details.\n\nThank you 🤍`;

  return message;
}
