// ── Navigation ──────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Account", href: "/account" },
] as const;

// ── Brand messaging ─────────────────────────────────────────────────

export const BRAND = {
  name: "Elita Apparel",
  tagline: "Intrigue. Elegance. You.",
  motto: "Wrapped in Culture. Wrapped in Elita.",
  location: "Accra, Ghana",
  siteUrl: "https://elitaapparel.com", // Replace with actual
} as const;

// ── Social & Contact ────────────────────────────────────────────────
// Update these with your actual accounts — used across the entire app.

export const SOCIALS = {
  instagram: {
    handle: "@elitaapparel",
    url: "https://instagram.com/elitaapparel",
  },
  tiktok: {
    handle: "@elitaapparel",
    url: "https://tiktok.com/@elitaapparel",
  },
  twitter: {
    handle: "@elitaapparel",
    url: "https://x.com/elitaapparel",
  },
  facebook: {
    handle: "Elita Apparel",
    url: "https://facebook.com/elitaapparel",
  },
  whatsapp: {
    number: "+233553663183", // Replace with actual
    url: "https://wa.me/233553663183",
  },
  email: "info@elitaapparel.com",
  phone: "+233553663183", // Replace with actual
} as const;

export const BRAND_MESSAGES = [
  "Wrapped in Culture. Wrapped in Elita.",
  "Where culture meets craftsmanship.",
  "Celebrate Independence in style.",
  "As a Ghanaian, it's your time to shine.",
] as const;

// ── Product options ─────────────────────────────────────────────────

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const FABRIC_TYPES = [
  "Ankara",
  "Kente",
  "Adire",
  "Batik",
  "Dashiki",
  "Mud Cloth",
  "Kitenge",
  "Aso Oke",
  "Bogolan",
  "Wax Print",
] as const;

// ── Categories ──────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES = [
  "Two-Piece Sets",
  "Ready-to-Wear",
  "Dresses",
  "Skirts",
  "Tops",
  "Accessories",
] as const;

// ── Order statuses ──────────────────────────────────────────────────

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out for delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
] as const;

// ── Currency ────────────────────────────────────────────────────────

export const CURRENCY = {
  code: "GHS",
  symbol: "GH₵",
  locale: "en-GH",
} as const;

export function formatPrice(amount: number): string {
  return `${CURRENCY.symbol}${amount.toFixed(2)}`;
}

export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number,
): number {
  return price * (1 - discountPercentage / 100);
}
