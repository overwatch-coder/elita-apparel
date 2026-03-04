"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitContactMessage } from "@/lib/actions/contact";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await submitContactMessage(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        setIsSuccess(true);
        e.currentTarget.reset();
        toast.success("Message sent successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again or use WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-12 text-center h-full flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
          <Send className="h-8 w-8" />
        </div>
        <h3 className="font-serif text-2xl text-cream">Thank You!</h3>
        <p className="text-cream/70 max-w-sm">
          Your message has been received. Our team will get back to you within
          24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
          className="mt-6 border-cream/20 text-cream hover:bg-white/5 uppercase tracking-wider"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-cream/70">
            Full Name *
          </Label>
          <Input
            required
            id="name"
            name="name"
            placeholder="Ama Mensah"
            className="bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-cream/70">
            Email Address *
          </Label>
          <Input
            required
            type="email"
            id="email"
            name="email"
            placeholder="ama@example.com"
            className="bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-cream/70">
          Phone Number (Optional)
        </Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+233 XX XXX XXXX"
          className="bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-cream/70">
          Subject *
        </Label>
        <select
          required
          id="subject"
          name="subject"
          className="flex h-12 w-full rounded-md border border-cream/10 bg-black/20 px-3 py-2 text-sm text-cream ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled selected hidden>
            Select a topic
          </option>
          <option value="Customer Support" className="bg-royal-black">
            Customer Support / Order Help
          </option>
          <option value="Custom Tailoring" className="bg-royal-black">
            Custom Tailoring Inquiry
          </option>
          <option value="Wholesale" className="bg-royal-black">
            Wholesale / Partnership
          </option>
          <option value="Press" className="bg-royal-black">
            Press / Media
          </option>
          <option value="Other" className="bg-royal-black">
            Other Inquiries
          </option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-cream/70">
          Your Message *
        </Label>
        <Textarea
          required
          id="message"
          name="message"
          placeholder="How can we help you today?"
          className="min-h-[150px] bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 resize-y"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gold hover:bg-gold-dark text-white h-14 uppercase tracking-wider text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
