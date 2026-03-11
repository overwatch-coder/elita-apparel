import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/store/whatsapp-button";
import { PopupManager } from "@/components/marketing/popup-manager";
import Script from "next/script";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <WhatsAppButton />
      <PopupManager />
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
      />
      <Footer />
    </>
  );
}
