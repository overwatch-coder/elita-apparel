"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Grid3X3, ImageIcon, Ruler, Info } from "lucide-react";

type DisplayMode = "table" | "image";

const SIZE_DATA = {
  women: {
    label: "Women's Clothing",
    headers: ["Size", "US", "Bust (in)", "Waist (in)", "Hips (in)", "Bust (cm)", "Waist (cm)", "Hips (cm)"],
    rows: [
      ["XS", "0–2", "31–32", "24–25", "34–35", "79–81", "61–64", "86–89"],
      ["S", "4–6", "33–34", "26–27", "36–37", "84–86", "66–69", "91–94"],
      ["M", "8–10", "35–36", "28–29", "38–39", "89–91", "71–74", "97–99"],
      ["L", "12–14", "37–39", "30–32", "40–42", "94–99", "76–81", "102–107"],
      ["XL", "16–18", "40–42", "33–35", "43–45", "102–107", "84–89", "109–114"],
      ["XXL", "20–22", "43–45", "36–38", "46–48", "109–114", "91–97", "117–122"],
    ],
  },
  men: {
    label: "Men's Clothing",
    headers: ["Size", "US", "Chest (in)", "Waist (in)", "Hips (in)", "Chest (cm)", "Waist (cm)", "Hips (cm)"],
    rows: [
      ["XS", "34", "34–35", "28–29", "35–36", "86–89", "71–74", "89–91"],
      ["S", "36", "36–37", "30–31", "37–38", "91–94", "76–79", "94–97"],
      ["M", "38–40", "38–40", "32–33", "39–40", "97–102", "81–84", "99–102"],
      ["L", "42–44", "41–43", "34–36", "41–43", "104–109", "86–91", "104–109"],
      ["XL", "46–48", "44–46", "37–39", "44–46", "112–117", "94–99", "112–117"],
      ["XXL", "50–52", "47–49", "40–42", "47–49", "119–124", "102–107", "119–124"],
    ],
  },
};

interface SizeChartDisplayProps {
  guides: Array<{
    id: string;
    title: string;
    content_html: string;
    category?: string | null;
  }>;
}

export function SizeChartDisplay({ guides }: SizeChartDisplayProps) {
  const [mode, setMode] = useState<DisplayMode>("table");
  const [activeCategory, setActiveCategory] = useState<"women" | "men">("women");

  return (
    <div className="space-y-10">
      {/* Mode toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border">
          <button
            onClick={() => setMode("table")}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all",
              mode === "table"
                ? "bg-gold text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            Size Table
          </button>
          <button
            onClick={() => setMode("image")}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all",
              mode === "image"
                ? "bg-gold text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ImageIcon className="h-4 w-4" />
            Image Chart
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border">
          <button
            onClick={() => setActiveCategory("women")}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeCategory === "women"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Women
          </button>
          <button
            onClick={() => setActiveCategory("men")}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeCategory === "men"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Men
          </button>
        </div>
      </div>

      {/* Table mode */}
      {mode === "table" && (
        <div className="space-y-10">
          {/* Built-in size table */}
          <SizeTable data={SIZE_DATA[activeCategory]} />

          {/* Database guides if any */}
          {guides.length > 0 && (
            <div className="space-y-12 pt-8 border-t border-border">
              <h2 className="font-serif text-2xl text-foreground">Additional Guides</h2>
              {guides.map((guide) => (
                <section key={guide.id} className="space-y-4">
                  <h3 className="font-serif text-xl text-foreground">
                    {guide.title}
                  </h3>
                  {guide.category && (
                    <p className="text-xs text-gold tracking-widest uppercase">
                      {guide.category}
                    </p>
                  )}
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-muted [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm"
                    dangerouslySetInnerHTML={{ __html: guide.content_html }}
                  />
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image mode */}
      {mode === "image" && (
        <div className="space-y-6">
          <SizeChartImage category={activeCategory} />
        </div>
      )}

      {/* How to measure */}
      <div className="p-6 rounded-xl bg-gold/5 border border-gold/10">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-lg font-medium text-gold">
            How to Measure
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MeasureTip title="Bust / Chest" desc="Measure around the fullest part of your bust or chest, keeping the tape level." />
          <MeasureTip title="Waist" desc="Measure around the narrowest part of your natural waist, usually just above the belly button." />
          <MeasureTip title="Hips" desc="Measure around the widest part of your hips, approximately 8 inches below your waist." />
          <MeasureTip title="Length" desc="Measure from the highest point of your shoulder to your desired hem length." />
        </div>
      </div>

      {/* Fit tip */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
        <Info className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <p>
          If you&apos;re between sizes, we recommend sizing up for a more comfortable fit.
          Our pieces are designed with a relaxed silhouette that flatters all body types.
          For custom sizing or any questions, feel free to <a href="/contact" className="text-gold hover:underline">contact us</a>.
        </p>
      </div>
    </div>
  );
}

/* ── Size table component ──────────────────────────────────────────── */

function SizeTable({ data }: { data: typeof SIZE_DATA.women }) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl text-foreground">{data.label}</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-none sm:rounded-xl border border-border">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-muted">
              {data.headers.map((header) => (
                <th
                  key={header}
                  className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-foreground whitespace-nowrap border-b border-border"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr
                key={row[0]}
                className={cn(
                  "transition-colors hover:bg-gold/5",
                  i % 2 === 0 ? "bg-background" : "bg-muted/30"
                )}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap border-b border-border/50",
                      j === 0 && "font-semibold text-gold"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Image chart component ─────────────────────────────────────────── */

function SizeChartImage({ category }: { category: "women" | "men" }) {
  const chart = {
    women: {
      src: "/size-chart-women.svg",
      alt: "Elita Apparel Women's Size Chart — body silhouette with bust, waist, hip measurements and size table from XS to XXL",
      label: "Women's Size Chart",
    },
    men: {
      src: "/size-chart-men.svg",
      alt: "Elita Apparel Men's Size Chart — body silhouette with chest, waist, hip measurements and size table from XS to XXL",
      label: "Men's Size Chart",
    },
  }[category];

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl text-foreground">{chart.label}</h2>
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Image
          key={category}
          src={chart.src}
          alt={chart.alt}
          width={900}
          height={1100}
          className="w-full h-auto"
          priority
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Switch to the <strong>Size Table</strong> tab for an interactive measurement breakdown.
      </p>
    </div>
  );
}

/* ── Measurement tip ───────────────────────────────────────────────── */

function MeasureTip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
