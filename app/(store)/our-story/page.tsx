import { BRAND, BRAND_MESSAGES } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Elita Apparel",
  description:
    "Discover the story behind Elita Apparel — celebrating African heritage through elite craftsmanship, from Accra, Ghana to the world.",
};

const VALUES = [
  {
    title: "Premium Fabrics",
    description:
      "Sourced from the finest textile markets across West Africa",
  },
  {
    title: "Expert Tailoring",
    description: "Every stitch reflects generations of craftsmanship",
  },
  {
    title: "Cultural Roots",
    description: "Each design tells a story of heritage and identity",
  },
];

export default function OurStoryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-background pt-24 lg:pt-32 pb-16 border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <p className="text-gold tracking-[0.4em] uppercase text-xs mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-6">
            Celebrating African Heritage Through{" "}
            <span className="text-gold">Elite Craftsmanship</span>
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>
      </section>

      {/* Narrative */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6 text-foreground/70 leading-relaxed">
            <p>
              Our brand celebrates the rich heritage and vibrant artistry of
              African prints. Each piece is thoughtfully designed to blend
              tradition with modern style, turning cultural patterns into
              wearable expressions of confidence and grace.
            </p>
            <p>
              From bold batiks to intricate designs, we create clothing that
              empowers you to embrace your story, honor your roots, and shine
              with timeless elegance. Each garment represents a bridge between
              our ancestry and the contemporary world, meticulously crafted for
              those who value authenticity.
            </p>
            <p>
              At {BRAND.name}, we believe that what you wear is a reflection of
              your journey. We are committed to providing elite African wear that
              makes a statement without saying a word.
            </p>
          </div>
        </div>
      </section>

      {/* Value propositions */}
      <section className="py-16 lg:py-24 bg-card border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {VALUES.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-px bg-gold mx-auto mb-6" />
                <h3 className="font-serif text-lg text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-border/50 text-center">
            <p className="text-muted-foreground/50 tracking-[0.3em] uppercase text-xs">
              {BRAND_MESSAGES[0]}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
