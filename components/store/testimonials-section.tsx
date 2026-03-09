"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIALS } from "@/lib/constants";

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30 text-foreground overflow-hidden border-y border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary tracking-[0.4em] uppercase text-xs mb-4"
          >
            Kind Words
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-6"
          >
            What Our Clients Are Saying
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-px bg-primary mx-auto"
          />
        </div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {TESTIMONIALS.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full md:basis-1/2"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="bg-card border-border/50 h-full backdrop-blur-sm hover:border-primary/30 transition-colors duration-500 shadow-sm">
                      <CardContent className="p-8 flex flex-col justify-between h-full">
                        <div>
                          <Quote className="h-10 w-10 text-primary/20 mb-6" />
                          <div className="flex gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5 fill-primary text-primary"
                              />
                            ))}
                          </div>
                          <p className="font-serif text-lg lg:text-xl leading-relaxed italic text-foreground/80 mb-8">
                            &ldquo;{testimonial.content}&rdquo;
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {testimonial.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {testimonial.name}
                            </p>
                            <p className="text-xs text-primary/70 tracking-wider uppercase font-semibold">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="static sm:absolute -left-12 top-1/2 -translate-y-1/2 bg-background border-border hover:bg-primary hover:text-white h-10 w-10 transition-all duration-300 shadow-md" />
              <CarouselNext className="static sm:absolute -right-12 top-1/2 -translate-y-1/2 bg-background border-border hover:bg-primary hover:text-white h-10 w-10 transition-all duration-300 shadow-md" />
            </div>

            {/* Mobile Controls */}
            <div className="flex justify-center gap-4 mt-8 sm:hidden">
              <CarouselPrevious className="static bg-background border-border text-foreground hover:bg-primary hover:text-white h-10 w-10 transition-all duration-300 translate-y-0 shadow-sm" />
              <CarouselNext className="static bg-background border-border text-foreground hover:bg-primary hover:text-white h-10 w-10 transition-all duration-300 translate-y-0 shadow-sm" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
