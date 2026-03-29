import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Elita Apparel",
  description:
    "Learn about shipping methods, timeframes, and costs for Elita Apparel orders.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen container mx-auto px-4 lg:px-8 max-w-4xl">
      <h1 className="font-serif text-4xl mb-8">Shipping Policy</h1>

      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>
          At Elita Apparel, we want your order to arrive safely and on time.
          Here&apos;s everything you need to know about shipping with us:
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            Processing Time
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Orders are typically processed within 2–3 business days.
            </li>
            <li>
              You will receive a confirmation email once your order has shipped.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            Shipping Methods &amp; Timeframes
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Standard Shipping: 4–7 business days</li>
            <li>Expedited Shipping: 2–4 business days</li>
          </ul>
          <p>
            Please note that shipping times may vary during holidays or peak
            seasons.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            Shipping Costs
          </h2>
          <p>
            Shipping costs are calculated at checkout based on your location and
            order weight.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            International Shipping
          </h2>
          <p>
            We do offer international shipping to select countries. Customs
            duties, taxes, or additional fees may apply for international orders,
            which are the responsibility of the customer.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            Order Tracking
          </h2>
          <p>
            Once your order ships, you&apos;ll receive a tracking number via
            email so you can monitor your package.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            Lost or Delayed Orders
          </h2>
          <p>
            If your order is lost or delayed, please contact us at{" "}
            <a
              href="mailto:opatadedoemmanuella@gmail.com"
              className="text-gold hover:text-gold-dark transition-colors"
            >
              opatadedoemmanuella@gmail.com
            </a>{" "}
            and we&apos;ll help resolve the issue.
          </p>
        </section>

        <p className="text-xs pt-8">
          Thank you for shopping with Elita Apparel! We appreciate your support
          and aim to make your shopping experience smooth and enjoyable.
        </p>
      </div>
    </div>
  );
}
