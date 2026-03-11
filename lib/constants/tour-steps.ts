import type { Step } from "react-joyride";

/** ─── Admin Tour Steps ────────────────────────────────────────────────────── */
export const ADMIN_TOUR_STEPS: Step[] = [
  {
    target: "#admin-dashboard-link",
    title: "📊 Dashboard",
    content:
      "This is your command centre. Get a real-time snapshot of store performance, revenue, and recent activity at a glance.",
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "#admin-products-link",
    title: "👗 Products",
    content:
      "Add, edit, and organise your clothing collections here. Manage stock, pricing, images, and publish products to the storefront.",
    placement: "right",
  },
  {
    target: "#admin-orders-link",
    title: "📦 Orders",
    content:
      "View and fulfil all customer purchases. Update order statuses, add tracking information, and manage returns from here.",
    placement: "right",
  },
  {
    target: "#admin-marketing-link",
    title: "📣 Marketing",
    content:
      "Create email campaigns, set up automations, manage discount codes, and run promotions to grow your customer base.",
    placement: "right",
  },
  {
    target: "#admin-settings-link",
    title: "⚙️ Settings",
    content:
      "Configure store details, payment methods, integrations, and brand preferences. You can also restart this tour from the Help section here.",
    placement: "right",
  },
  {
    target: "body",
    title: "🎉 You're All Set!",
    content:
      "Your store is ready to start receiving orders. Explore each section or dive straight into adding your first product. Good luck!",
    placement: "center",
  },
];

/** ─── Customer Tour Steps ────────────────────────────────────────────────── */
export const CUSTOMER_TOUR_STEPS: Step[] = [
  {
    target: "#customer-account-link",
    title: "👋 Welcome to Your Account",
    content:
      "This is your personal dashboard. From here you can manage everything related to your orders and profile.",
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "#customer-orders-link",
    title: "📦 Your Orders",
    content:
      "Track all your purchases in one place. View order details, check delivery status, and get tracking information.",
    placement: "right",
  },
  {
    target: "#customer-addresses-link",
    title: "📍 Shipping Addresses",
    content:
      "Save multiple delivery addresses and set a default one to speed up checkout next time.",
    placement: "right",
  },
  {
    target: "#customer-wishlist-link",
    title: "❤️ Wishlist",
    content:
      "Save items you love for later. Your wishlist is always synced so you never lose track of your favourites.",
    placement: "right",
  },
  {
    target: "#customer-profile-link",
    title: "👤 Profile Settings",
    content:
      "Update your name, phone number, and other personal details here. You can also restart this tour from this section anytime.",
    placement: "right",
  },
];

/** Map: step index → required pathname for multi-page navigation */
export const ADMIN_STEP_ROUTES: Record<number, string> = {
  0: "/admin",
  1: "/admin/products",
  2: "/admin/orders",
  3: "/admin/marketing",
  4: "/admin/settings",
  5: "/admin",
};

export const CUSTOMER_STEP_ROUTES: Record<number, string> = {
  0: "/account",
  1: "/account/orders",
  2: "/account/addresses",
  3: "/account/wishlist",
  4: "/account/profile",
};
