import { getSizeGuides } from "@/app/actions/size-guides";
import { SizeChartDisplay } from "@/components/store/size-chart-display";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Chart | Elita Apparel",
  description:
    "Find your perfect fit with the Elita Apparel size chart and measurement guide.",
};

export default async function SizeChartPage() {
  const { guides } = await getSizeGuides();

  return (
    <div className="pt-32 pb-20 min-h-screen container mx-auto px-4 lg:px-8 max-w-5xl">
      <h1 className="font-serif text-4xl mb-4">Size Chart</h1>
      <p className="text-muted-foreground mb-10 leading-relaxed">
        Find your perfect fit using our detailed size tables or visual chart.
        Switch between views using the toggle below.
      </p>

      <SizeChartDisplay guides={guides ?? []} />
    </div>
  );
}
