import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Elita Apparel",
  description:
    "Our return, refund, and exchange policy for Elita Apparel purchases.",
};

export default function RefundPolicyPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen container mx-auto px-4 lg:px-8 max-w-4xl">
      <h1 className="font-serif text-4xl mb-8">Refund Policy</h1>

      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Thank you for shopping with Elita Apparel! We want you to be
          completely satisfied with your purchase. If for any reason you are not
          happy with your order, we are here to help.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">Returns</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              You have 30 days from the date of delivery to return items for a
              refund or exchange.
            </li>
            <li>
              Items must be in their original condition, unworn, and with tags
              attached.
            </li>
            <li>Custom or personalized items are not eligible for return.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">Refunds</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Once we receive your returned item, we will inspect it and notify
              you of the approval status.
            </li>
            <li>
              If approved, your refund will be processed to your original
              payment method within 5–10 business days.
            </li>
            <li>Shipping costs are non-refundable.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">Exchanges</h2>
          <p>
            If you wish to exchange an item for a different size or color,
            please contact us at{" "}
            <a
              href="mailto:opatadedoemmanuella@gmail.com"
              className="text-gold hover:text-gold-dark transition-colors"
            >
              opatadedoemmanuella@gmail.com
            </a>{" "}
            to initiate the exchange.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">How to Return</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Contact us at{" "}
              <a
                href="mailto:opatadedoemmanuella@gmail.com"
                className="text-gold hover:text-gold-dark transition-colors"
              >
                opatadedoemmanuella@gmail.com
              </a>{" "}
              with your order number and reason for return.
            </li>
            <li>
              Follow the instructions provided for returning your item.
            </li>
          </ul>
        </section>

        <p className="text-xs pt-8">
          We appreciate your business and strive to make your shopping
          experience seamless and enjoyable!
        </p>
      </div>
    </div>
  );
}
