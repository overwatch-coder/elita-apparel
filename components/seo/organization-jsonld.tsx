import { BRAND, SOCIALS } from "@/lib/constants";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Elita Apparel",
    url: process.env.NEXT_PUBLIC_SITE_URL || BRAND.siteUrl,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || BRAND.siteUrl}/logo.png`,
    description:
      "Premium African fashion house celebrating culture through elite craftsmanship. Based in Accra, Ghana.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: SOCIALS.email,
      telephone: SOCIALS.phone,
      contactType: "customer service",
    },
    sameAs: [SOCIALS.instagram.url, SOCIALS.tiktok.url, SOCIALS.twitter.url],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
