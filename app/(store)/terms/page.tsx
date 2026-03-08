import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Elita Apparel",
  description:
    "Terms and Conditions for Elita Apparel, compliant with the Ghana Electronic Transactions Act (Act 772).",
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen container mx-auto px-4 lg:px-8 max-w-4xl">
      <h1 className="font-serif text-4xl mb-8">Terms & Conditions</h1>

      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Welcome to Elita Apparel. By accessing our website and making a
          purchase, you agree to be bound by the following Terms and Conditions,
          which comply with the **Ghana Electronic Transactions Act, 2008 (Act
          772)**.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            1. Electronic Contracts
          </h2>
          <p>
            In accordance with Act 772, your online order constitutes a valid
            electronic contract between you and Elita Apparel. By clicking
            "Place Order" or "Confirm Payment", you acknowledge your intent to
            enter into a legally binding agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            2. Pricing and Payment
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              All prices are listed in Ghana Cedis (GH₵) and include applicable
              taxes unless stated otherwise.
            </li>
            <li>
              We offer secure online payments via Paystack and manual
              bank/mobile money transfers.
            </li>
            <li>
              For manual transfers, proof of payment must be uploaded on our
              platform for verification before order processing begins.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            3. Delivery and Shipping
          </h2>
          <p>
            We deliver across Ghana and select international locations. Delivery
            times are estimates and may vary based on location and courier
            availability. Elita Apparel is not liable for delays caused by
            third-party logistics providers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            4. Returns and Refunds
          </h2>
          <p>As per our commitment to consumer protection:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Items can be returned within 48 hours of delivery if they are
              found to be defective or significantly different from the
              description.
            </li>
            <li>
              Returned items must be unworn, unwashed, and in their original
              packaging with tags intact.
            </li>
            <li>
              Refunds will be processed once the returned item has been
              inspected and approved.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            5. Intellectual Property
          </h2>
          <p>
            All content on this website, including designs, images, and text, is
            the property of Elita Apparel and is protected by Ghanaian and
            international copyright laws. Unauthorized reproduction or use is
            strictly prohibited.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            6. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, Elita Apparel shall not be
            liable for any indirect, incidental, or consequential damages
            arising from the use of our website or products.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            7. Governing Law
          </h2>
          <p>
            These Terms and Conditions are governed by and construed in
            accordance with the laws of the Republic of Ghana. Any disputes
            shall be subject to the exclusive jurisdiction of the courts of
            Ghana.
          </p>
        </section>

        <p className="text-xs pt-8">Last updated: March 2026.</p>

        <div className="pt-4">
          <Link href="/contact" className="text-gold hover:underline">
            Contact us if you have any questions regarding these terms.
          </Link>
        </div>
      </div>
    </div>
  );
}
