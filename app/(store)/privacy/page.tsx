import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Elita Apparel",
  description:
    "Privacy Policy for Elita Apparel, compliant with the Ghana Data Protection Act (Act 843).",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen container mx-auto px-4 lg:px-8 max-w-4xl">
      <h1 className="font-serif text-4xl mb-8">Privacy Policy</h1>

      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>
          At Elita Apparel, we are committed to protecting your privacy and
          ensuring the security of your personal data. This Privacy Policy
          outlines how we collect, use, and safeguard your information in
          compliance with the **Ghana Data Protection Act, 2012 (Act 843)**.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            1. Information We Collect
          </h2>
          <p>
            We collect personal information that you provide to us when you make
            a purchase, sign up for our newsletter, or contact us. This may
            include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Name and contact details (email, phone number, shipping address).
            </li>
            <li>
              Payment information (processed securely through our partners like
              Paystack).
            </li>
            <li>Purchase history and preferences.</li>
            <li>
              Device information and IP address through cookies for site
              optimization.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            2. Purpose of Processing
          </h2>
          <p>
            In accordance with Act 843, we process your data for the following
            lawful purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To process and deliver your orders.</li>
            <li>
              To communicate with you regarding your purchases or inquiries.
            </li>
            <li>
              To send marketing communications, provided you have given explicit
              consent.
            </li>
            <li>To improve our website functionality and user experience.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            3. Data Security
          </h2>
          <p>
            We implement robust technical and organizational measures to protect
            your data against unauthorized access, loss, or theft. This includes
            the use of encrypted connections and secure payment gateways.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">
            4. Disclosure to Third Parties
          </h2>
          <p>
            We do not sell your personal data. We only share information with
            trusted third parties necessary for fulfilling our services, such
            as:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Delivery partners and couriers within Ghana and internationally.
            </li>
            <li>Payment processors (Paystack).</li>
            <li>Email service providers for newsletter delivery.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">5. Your Rights</h2>
          <p>
            Under the Data Protection Act (Act 843), you have the following
            rights:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The right to access the personal data we hold about you.</li>
            <li>The right to request the correction of inaccurate data.</li>
            <li>
              The right to object to the processing of your data for direct
              marketing.
            </li>
            <li>
              The right to request the deletion of your data under certain
              conditions.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-foreground">6. Contact Us</h2>
          <p>
            If you have any questions about this policy or wish to exercise your
            data rights, please contact our Data Protection Officer at:
            <br />
            <strong>Email:</strong> bellamoner98@gmail.com
            <br />
            <strong>Phone:</strong> 0553663183
          </p>
        </section>

        <p className="text-xs pt-8">
          Last updated: March 2026. This policy is subject to change in
          accordance with evolving regulations in Ghana.
        </p>
      </div>
    </div>
  );
}
