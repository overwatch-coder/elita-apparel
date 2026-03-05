import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/cart/cart-provider";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Elita Apparel | Premium African Fashion",
    template: "%s | Elita Apparel",
  },
  description:
    "Wrapped in Culture. Wrapped in Elita. Premium African fashion celebrating heritage through elite craftsmanship. Shop authentic African prints, two-piece sets, and ready-to-wear from Accra, Ghana.",
  keywords: [
    "African fashion",
    "Ghanaian fashion",
    "African prints",
    "Ankara",
    "Kente",
    "premium fashion",
    "Accra Ghana",
    "Elita Apparel",
    "African two-piece",
    "ready-to-wear",
  ],
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "Elita Apparel",
    title: "Elita Apparel | Premium African Fashion",
    description:
      "Wrapped in Culture. Wrapped in Elita. Premium African fashion from Accra, Ghana.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elita Apparel | Premium African Fashion",
    description:
      "Wrapped in Culture. Wrapped in Elita. Premium African fashion from Accra, Ghana.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground selection:bg-gold/30 selection:text-white transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <CartProvider>
              <WishlistProvider>
                {children}
                <Toaster position="bottom-right" />
              </WishlistProvider>
            </CartProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
