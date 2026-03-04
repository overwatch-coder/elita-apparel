import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";
import { BRAND, SOCIALS } from "@/lib/constants";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Contact Us - " + BRAND.name,
  description: "Get in touch with us for inquiries, custom orders, or support.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl mb-4 text-cream">
            Contact Us
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="text-cream/70 max-w-2xl mx-auto text-lg leading-relaxed">
            We'd love to hear from you. Whether you have a question about our
            collections, need help with an order, or want to discuss a custom
            piece, our team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Information */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="font-serif text-2xl text-cream">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 flex items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/20 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-cream mb-1 text-lg">
                      Our Location
                    </h3>
                    <p className="text-cream/70">{BRAND.location}</p>
                    <p className="text-cream/50 text-sm mt-1">
                      Available for in-person consultations by appointment only.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 flex items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/20 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-cream mb-1 text-lg">
                      Phone
                    </h3>
                    <p className="text-cream/70">
                      <a
                        href={`tel:${SOCIALS.phone}`}
                        className="hover:text-gold transition-colors"
                      >
                        {SOCIALS.phone}
                      </a>
                    </p>
                    <p className="text-cream/50 text-sm mt-1">
                      Mon-Fri from 9am to 6pm GMT
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 flex items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/20 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-cream mb-1 text-lg">
                      Email
                    </h3>
                    <p className="text-cream/70">
                      <a
                        href={`mailto:${SOCIALS.email}`}
                        className="hover:text-gold transition-colors"
                      >
                        {SOCIALS.email}
                      </a>
                    </p>
                    <p className="text-cream/50 text-sm mt-1">
                      We aim to reply within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 flex items-center justify-center rounded-full bg-ghana-green/10 text-ghana-green border border-ghana-green/20 shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-cream mb-1 text-lg">
                      WhatsApp
                    </h3>
                    <p className="text-cream/70">
                      <a
                        href={SOCIALS.whatsapp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ghana-green transition-colors"
                      >
                        {SOCIALS.whatsapp.number}
                      </a>
                    </p>
                    <p className="text-cream/50 text-sm mt-1">
                      Fastest response for quick queries
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-cream/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -z-10" />
              <h3 className="font-serif text-xl text-gold mb-3">
                Custom Tailoring
              </h3>
              <p className="text-cream/70 leading-relaxed text-sm">
                Looking for something remarkably unique? We offer bespoke
                tailoring services for special occasions. Fill out the form or
                reach out directly to schedule a virtual or in-person
                consultation with our design team.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/5 border border-cream/10 p-8 sm:p-10 rounded-2xl shadow-xl">
            <h2 className="font-serif text-2xl text-cream mb-6">
              Send us a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
