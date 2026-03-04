import { getDiscountCodes } from "@/lib/actions/discounts";
import { getPopupById } from "@/lib/actions/marketing-popups";
import { PopupForm } from "@/components/admin/marketing/popup-form";
import { notFound } from "next/navigation";

interface EditPopupPageProps {
  params: {
    id: string;
  };
}

export default async function EditPopupPage({ params }: EditPopupPageProps) {
  const { id } = params;
  const { popup, error } = await getPopupById(id);
  const { codes = [] } = await getDiscountCodes();

  if (error || !popup) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-foreground">
          Edit Marketing Popup
        </h1>
        <p className="text-muted-foreground mt-1">
          Update the design, targeting, or active status of your popup.
        </p>
      </div>

      <PopupForm initialData={popup} discountCodes={codes} />
    </div>
  );
}
