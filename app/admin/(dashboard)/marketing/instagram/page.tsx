import { InstagramManager } from "@/components/admin/marketing/instagram-manager";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Instagram Feed Management | Admin",
  description: "Manage the Instagram feed displayed on the store landing page.",
};

export default function InstagramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif">Instagram Feed</h1>
        <p className="text-muted-foreground">
          Configure which Instagram posts are showcased on your landing page.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        }
      >
        <InstagramManager />
      </Suspense>
    </div>
  );
}
