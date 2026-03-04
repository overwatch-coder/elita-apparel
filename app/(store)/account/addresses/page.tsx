import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AddressFormDialog } from "./address-form-dialog";
import { AddressList } from "./address-list";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch addresses
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-cream mb-2">
            Saved Addresses
          </h1>
          <p className="text-cream/70 text-sm">
            Manage your shipping destinations for faster checkout.
          </p>
        </div>
        <AddressFormDialog />
      </div>

      {addresses && addresses.length > 0 ? (
        <AddressList addresses={addresses} />
      ) : (
        <div className="bg-white/5 border border-cream/10 rounded-lg p-10 text-center">
          <h3 className="text-lg font-serif text-cream mb-2">
            No addresses saved
          </h3>
          <p className="text-sm text-cream/70 max-w-sm mx-auto">
            You haven't added any shipping addresses yet. Add one now to speed
            up your next checkout.
          </p>
        </div>
      )}
    </div>
  );
}
