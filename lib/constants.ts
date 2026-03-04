// ── Navigation ──────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
] as const;

// ── Brand messaging ─────────────────────────────────────────────────

export const BRAND = {
  name: "Elita Apparel",
  tagline: "Intrigue. Elegance. You.",
  motto: "Wrapped in Culture. Wrapped in Elita.",
  location: "Accra, Ghana",
  whatsappNumber: "+233000000000", // Replace with actual
  instagramHandle: "@elitaapparel",
  email: "info@elitaapparel.com",
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
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
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
