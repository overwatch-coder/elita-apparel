"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/constants";
import { useEffect, useState } from "react";

// Simple pub-sub mechanism to avoid passing context down through the tree
let activeProductName: string | undefined = undefined;
const listeners = new Set<(name: string | undefined) => void>();

export function setWhatsAppProductName(name: string | undefined) {
  activeProductName = name;
  listeners.forEach((listener) => listener(name));
}

// Client component to be dropped into the product details page
export function WhatsAppProductSync({ productName }: { productName: string }) {
  useEffect(() => {
    setWhatsAppProductName(productName);
    return () => setWhatsAppProductName(undefined); // Clean up when leaving the page
  }, [productName]);
  
  return null;
}

export function WhatsAppButton() {
  const [productName, setLocalProductName] = useState<string | undefined>(activeProductName);

  useEffect(() => {
    listeners.add(setLocalProductName);
    return () => {
      listeners.delete(setLocalProductName);
    };
  }, []);

  const message = productName
    ? `Hi! I'm interested in the *${productName}*. Could you tell me more about it?`
    : "Hi! I'd like to inquire about your products.";

  const whatsappUrl = `${SOCIALS.whatsapp.url}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      size="lg"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-[#128C7E]/30 transition-all duration-300 hover:scale-110 p-0"
      aria-label="Chat on WhatsApp"
    >
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-6 w-6" />
      </Link>
    </Button>
  );
}
