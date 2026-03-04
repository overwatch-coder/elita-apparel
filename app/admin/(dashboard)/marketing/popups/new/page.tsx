import { getDiscountCodes } from "@/lib/actions/discounts";
import { PopupForm } from "@/components/admin/marketing/popup-form";

export default async function NewPopupPage() {
  const { codes = [] } = await getDiscountCodes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-foreground">
          Create New Popup
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure a collection or behavior-based popup to capture more leads.
        </p>
      </div>

      <PopupForm discountCodes={codes} />
    </div>
  );
}
