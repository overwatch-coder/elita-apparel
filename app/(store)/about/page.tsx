import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, SOCIALS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Elita Apparel",
  description:
    "Meet the founder behind Elita Apparel and discover the story, values, and vision shaping our premium African fashion house in Accra, Ghana.",
};

const FOUNDER = {
  name: "Emmanuella Opata Dedo",
  role: "Founder & Creative Director",
  image: "/elita.png",
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

const STORY_PILLARS = [
  {
    title: "A personal point of view",
    description:
      "Elita began with Emmanuella's desire to create clothing that feels polished, rooted, and unmistakably African without losing softness or modern ease.",
  },
  {
    title: "Heritage, made wearable",
    description:
      "Every collection translates cultural memory into silhouettes that work for celebrations, everyday confidence, and the moments people want to remember.",
  },
  {
    title: "Elegance with intention",
    description:
      "The brand is built around considered tailoring, expressive print stories, and pieces designed to hold presence long after the first wear.",
  },
];

const CARE_TIPS = [
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
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/50 bg-[radial-gradient(circle_at_top_left,rgba(200,162,77,0.18),transparent_32%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--background))_62%,hsl(var(--card))_100%)] pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.38em] text-gold">
                Meet The Founder
              </p>
              <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Elita starts with a woman who wanted African fashion to feel as
                elevated as the stories behind it.
              </h1>
              <div className="mt-8 space-y-5 text-base leading-8 text-foreground/72 sm:text-lg">
                <p>
                  <span className="font-semibold text-foreground">
                    {FOUNDER.name}
                  </span>{" "}
                  founded Elita Apparel to create pieces that carry culture with
                  poise. What began as a personal love for expressive fabrics,
                  refined silhouettes, and intentional dressing grew into a
                  fashion house built around confidence, heritage, and grace.
                </p>
                <p>
                  From {BRAND.location}, she is shaping a brand where African
                  prints are not treated as costume or trend, but as timeless
                  design language for women who want to look powerful, elegant,
                  and fully themselves.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-foreground/60">
                <span className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-gold">
                  {FOUNDER.role}
                </span>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold text-primary-foreground hover:bg-gold-dark uppercase tracking-[0.18em]"
                >
                  <Link href="/shop">
                    Explore The Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gold/30 bg-background/60 uppercase tracking-[0.18em] backdrop-blur-sm"
                >
                  <a
                    href={SOCIALS.whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Speak With Elita
                  </a>
                </Button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-[linear-gradient(160deg,rgba(248,243,234,0.96)_0%,rgba(239,230,215,0.86)_35%,rgba(43,33,24,0.12)_100%)] p-5 shadow-[0_30px_90px_rgba(28,21,16,0.18)] dark:bg-[linear-gradient(160deg,rgba(36,28,24,0.98)_0%,rgba(23,19,17,0.98)_55%,rgba(200,162,77,0.18)_100%)]">
                <div className="relative aspect-4/5 overflow-hidden rounded-[1.6rem] border border-gold/15 bg-[radial-gradient(circle_at_top,rgba(200,162,77,0.28),transparent_34%),linear-gradient(180deg,rgba(43,33,24,0.04)_0%,rgba(43,33,24,0.14)_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(200,162,77,0.18),transparent_28%),linear-gradient(180deg,rgba(248,243,234,0.02)_0%,rgba(248,243,234,0.08)_100%)]">
                  <div className="absolute inset-5 rounded-[1.35rem] border border-dashed border-gold/25" />
                  <div className="absolute left-6 top-6 h-20 w-20 rounded-full border border-gold/20" />
                  <div className="absolute bottom-6 right-6 h-28 w-28 rounded-full border border-gold/15" />
                  <Image
                    src={FOUNDER.image}
                    alt={`${FOUNDER.name} founder portrait`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 90vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,19,17,0.02)_0%,rgba(23,19,17,0.18)_48%,rgba(23,19,17,0.7)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-left">
                    <p className="mt-3 max-w-xs font-serif text-xl leading-snug text-white">
                      Wear your heritage with grace.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-2 pt-5 text-sm text-foreground/65">
                  <div>
                    <p className="font-semibold uppercase tracking-[0.25em] text-gold">
                      {FOUNDER.name}
                    </p>
                    <p className="mt-1">Founder-led vision, crafted in Ghana.</p>
                  </div>
                  <div className="h-px flex-1 bg-linear-to-r from-gold/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-8 shadow-sm backdrop-blur-sm lg:p-10">
              <p className="mb-4 text-xs uppercase tracking-[0.34em] text-gold">
                Why Elita Exists
              </p>
              <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
                A house built around identity, not imitation.
              </h2>
              <div className="mt-8 space-y-5 text-base leading-8 text-foreground/72">
                <p>
                  Elita Apparel was created for women who want clothing that
                  feels memorable before they even speak. The brand's point of
                  view is simple: heritage can be luxurious, contemporary, and
                  deeply personal at the same time.
                </p>
                <p>
                  That belief shapes everything from silhouette choice to print
                  placement. Each piece is meant to feel expressive, flattering,
                  and rooted in the richness of African design traditions.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {STORY_PILLARS.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-[1.5rem] border border-border/60 bg-background p-6 transition-colors hover:border-gold/30 hover:bg-card/70 lg:p-7"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-gold">
                    Founder Perspective
                  </p>
                  <h3 className="mt-3 font-serif text-2xl text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 leading-7 text-foreground/68">
                    {pillar.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-card py-16 lg:py-24">
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

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <p className="text-gold tracking-[0.3em] uppercase text-xs mb-2 text-center md:text-left">
                Mission & Vision
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-center md:text-left">
                Designed to celebrate African heritage with modern presence
              </h2>
              <div className="w-12 h-px bg-gold mb-8 mx-auto md:mx-0" />

              <div className="space-y-5 text-foreground/72 leading-8">
                <p>
                  Our mission is to celebrate African heritage through clothing
                  that feels vibrant, composed, and confidently modern. We want
                  every Elita piece to help its wearer feel seen, polished, and
                  connected to something meaningful.
                </p>
                <p>
                  Our vision is to continue building a fashion house recognized
                  for elite African wear that honors origin, embraces elegance,
                  and earns a lasting place in the wardrobes of women across the
                  world.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full rounded-[1.75rem] border border-border/60 bg-card/60 p-8 backdrop-blur-sm">
              <p className="text-center text-xs uppercase tracking-[0.32em] text-gold md:text-left">
                Care & Longevity
              </p>
              <h3 className="mt-4 text-center font-serif text-2xl text-foreground md:text-left">
                Keep every piece looking intentional
              </h3>
              <div className="mt-8 space-y-6">
                {CARE_TIPS.map((item, idx) => (
                  <div key={item.tip} className="flex gap-4">
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
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">
              Get In Touch
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl mb-8">
              Visit Elita in Accra
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
