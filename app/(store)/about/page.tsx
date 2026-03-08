import Link from "next/link";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, SOCIALS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Elita Apparel",
  description:
    "Elita Apparel is a premium African fashion house celebrating culture through elite craftsmanship. Based in Accra, Ghana.",
};

const VALUES = [
  {
    title: "Cultural Pride",
    description: "Honoring African heritage in every design.",
  },
  {
    title: "Elegance & Excellence",
    description:
      "Crafting elite, high-quality pieces that exude sophistication.",
  },
  {
    title: "Empowerment",
    description: "Inspiring confidence and self-expression in every wearer.",
  },
  {
    title: "Creativity & Innovation",
    description: "Blending tradition with modern, stylish designs.",
  },
  {
    title: "Authenticity & Integrity",
    description: "Staying true to our roots and ethical practices.",
  },
  {
    title: "Accessible Luxury",
    description:
      "Offering premium, culturally inspired fashion that is attainable and valued.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-background pt-24 lg:pt-32 pb-16 border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <p className="text-gold tracking-[0.4em] uppercase text-xs mb-4">
            Our Mission
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
            To celebrate African heritage through vibrant, modern clothing that
            empowers individuals to embrace their roots, express their unique
            style, and shine with confidence and elegance.
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>
      </section>

      {/* Brand story */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-6">
              Our Vision
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl mb-8">
              Celebrating African Heritage Through Elite African Wear
            </h2>
            <div className="space-y-6 text-foreground/70 leading-relaxed">
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
                our ancestry and the contemporary world, meticulously crafted
                for those who value authenticity.
              </p>
              <p>
                At Elita Apparel, we believe that what you wear is a reflection
                of your journey. We are committed to providing elite African
                wear that makes a statement without saying a word.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-card border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">
              What We Stand For
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">Our Values</h2>
            <div className="w-16 h-px bg-gold mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="text-center p-6 border border-border/50 rounded-lg hover:border-gold/30 transition-colors bg-background/50"
              >
                <h3 className="font-serif text-lg mb-3 text-gold">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clothing Tips */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <p className="text-gold tracking-[0.3em] uppercase text-xs mb-2 text-center md:text-left">
                Care & Longevity
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-center md:text-left">
                Clothing Tips
              </h2>
              <div className="w-12 h-px bg-gold mb-8 mx-auto md:mx-0" />

              <div className="space-y-6">
                {[
                  {
                    tip: "Gentle Washing",
                    desc: "Hand wash and use a mild detergent to preserve color and fabric quality.",
                  },
                  {
                    tip: "Proper Drying",
                    desc: "Avoid direct sunlight or tumble dryers when drying to prevent fading.",
                  },
                  {
                    tip: "Protect Patterns",
                    desc: "Iron on the reverse side on low heat to protect intricate patterns.",
                  },
                  {
                    tip: "Smart Storage",
                    desc: "Fold neatly or hang in a cool, dry place; breathable garment bags work best.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-gold text-xs font-bold">
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-foreground">
                        {item.tip}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full aspect-square relative rounded-2xl overflow-hidden bg-accent/20 border border-border/50">
              {/* Decorative elements for the tips section */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="font-serif text-2xl text-gold mb-2 italic">
                    Elite African Wear
                  </p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest">
                    Designed for your legacy
                  </p>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-gold/20 m-6" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-gold/20 m-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Location */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">
              Get In Touch
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl mb-8">
              Visit Us in Accra
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                {BRAND.location}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                {SOCIALS.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                {SOCIALS.phone}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-white tracking-wider uppercase px-8"
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="tracking-wider uppercase px-8"
              >
                <a
                  href={`${SOCIALS.whatsapp.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
