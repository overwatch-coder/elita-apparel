"use client";

import Link from "next/link";
import {
  BarChart3,
  MousePointer2,
  Instagram,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MARKETING_SECTIONS = [
  {
    title: "Marketing Analytics",
    description:
      "Track performance, conversion rates, and ROI across all channels.",
    href: "/admin/marketing/analytics",
    icon: BarChart3,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    stats: "Real-time tracking",
  },
  {
    title: "Campaigns",
    description:
      "Manage email marketing, newsletters, and promotional broadcasts.",
    href: "/admin/campaigns",
    icon: Megaphone,
    color: "text-gold",
    bgColor: "bg-gold/10",
    stats: "Email automation",
  },
  {
    title: "Marketing Popups",
    description: "Create and manage exit-intent, timed, and early-bird popups.",
    href: "/admin/marketing/popups",
    icon: MousePointer2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    stats: "Lead capture",
  },
  {
    title: "Instagram Manager",
    description: "Curate your storefront's Instagram feed and tag products.",
    href: "/admin/marketing/instagram",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    stats: "Social commerce",
  },
];

export default function MarketingHubPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif text-foreground">
          Marketing Center
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Everything you need to grow your brand. Manage your reach, engagement,
          and conversion strategies from one central place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MARKETING_SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="group hover:border-gold/30 transition-all duration-300 shadow-sm hover:shadow-md h-full cursor-pointer overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-xl ${section.bgColor} ${section.color} transition-colors group-hover:bg-gold/20`}
                  >
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-accent/30 px-2 py-1 rounded-md">
                    <TrendingUp className="h-3 w-3" />
                    {section.stats}
                  </div>
                </div>
                <CardTitle className="text-xl font-serif mt-4">
                  {section.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2 line-clamp-2">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex justify-end">
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-gold transition-colors">
                  Open Tools
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        <Card className="bg-accent/10 border-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-border">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-2xl font-serif">Audience</p>
              <Link
                href="/admin/audience"
                className="text-xs text-gold uppercase tracking-wider font-bold hover:underline"
              >
                View Customers
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-border">
              <Megaphone className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-2xl font-serif">Automations</p>
              <Link
                href="/admin/automations"
                className="text-xs text-gold uppercase tracking-wider font-bold hover:underline"
              >
                Email Flows
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-border">
              <Eye className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-2xl font-serif">Storefront</p>
              <a
                href="/"
                target="_blank"
                className="text-xs text-gold uppercase tracking-wider font-bold hover:underline"
              >
                Live View
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
