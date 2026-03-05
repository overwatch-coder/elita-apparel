import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/store/whatsapp-button";
import { PopupManager } from "@/components/marketing/popup-manager";

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
      <Footer />
    </>
  );
}
