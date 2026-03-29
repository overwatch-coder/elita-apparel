import { getSizeGuides } from "@/app/actions/size-guides";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Chart | Elita Apparel",
  description:
    "Find your perfect fit with the Elita Apparel size chart and measurement guide.",
};

export default async function SizeChartPage() {
  const { guides } = await getSizeGuides();

  return (
    <div className="pt-32 pb-20 min-h-screen container mx-auto px-4 lg:px-8 max-w-4xl">
      <h1 className="font-serif text-4xl mb-4">Size Chart</h1>
      <p className="text-muted-foreground mb-10 leading-relaxed">
        Use the guides below to find your perfect fit. If you&apos;re between
        sizes, we recommend sizing up for a more comfortable fit.
      </p>

      {/* How to measure */}
      <div className="p-6 rounded-lg bg-gold/5 border border-gold/10 mb-12">
        <h2 className="font-serif text-lg font-medium mb-3 text-gold">
          How to Measure
        </h2>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>
            <strong>Bust:</strong> Measure around the fullest part of your bust
          </li>
          <li>
            <strong>Waist:</strong> Measure around the narrowest part of your
            waist
          </li>
          <li>
            <strong>Hips:</strong> Measure around the widest part of your hips
          </li>
          <li>
            <strong>Length:</strong> Measure from shoulder to desired hem length
          </li>
        </ul>
      </div>

      {/* Size guides from database */}
      {guides.length > 0 ? (
        <div className="space-y-12">
          {guides.map((guide) => (
            <section key={guide.id} className="space-y-4">
              <h2 className="font-serif text-2xl text-foreground">
                {guide.title}
              </h2>
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
      ) : (
        <p className="text-center py-16 text-muted-foreground">
          Size guides are coming soon. Please check back later or contact us for
          sizing assistance.
        </p>
      )}
    </div>
  );
}
