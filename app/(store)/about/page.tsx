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
    title: "Cultural Heritage",
    description:
      "Every piece is rooted in African tradition, telling stories through authentic prints and patterns that span generations.",
  },
  {
    title: "Premium Craftsmanship",
    description:
      "Each garment reflects premium fabrics, expert tailoring, and detailed finishing — no shortcuts, no compromise.",
  },
  {
    title: "Elegant Design",
    description:
      "Our designs blend traditional African aesthetics with contemporary silhouettes, creating pieces that command attention.",
  },
  {
    title: "Authentic Fabrics",
    description:
      "We source the finest Ankara, Kente, Adire, and other authentic African fabrics directly from skilled artisans.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-background pt-24 lg:pt-32 pb-16 border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <p className="text-gold tracking-[0.4em] uppercase text-xs mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
            About Elita Apparel
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            A premium African fashion house celebrating culture through elite
            craftsmanship, founded in {BRAND.location}.
          </p>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>
      </section>

      {/* Brand story */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-6">
              The Vision
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl mb-8">
              {BRAND.motto}
            </h2>
            <div className="space-y-6 text-foreground/70 leading-relaxed">
              <p>
                Elita Apparel was born from a deep love for African culture and
                a desire to elevate how the world experiences African fashion.
                Based in the vibrant heart of Accra, Ghana, we create premium
                fashion pieces that honour our rich heritage while embracing
                modern elegance.
              </p>
              <p>
                Our name — <em>Elita</em> — speaks to our commitment to
                excellence. Every garment that carries our label has been
                carefully designed, meticulously crafted, and finished to the
                highest standards. We believe that African fashion deserves to
                stand among the world&apos;s finest, and we&apos;re here to make
                that a reality.
              </p>
              <p>
                From sourcing authentic fabrics like Kente, Ankara, and Adire,
                to working with skilled tailors who pour artistry into every
                stitch, each Elita piece is a celebration of who we are —
                culturally proud, elegantly crafted, and unapologetically
                premium.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {VALUES.map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="font-serif text-lg mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
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
