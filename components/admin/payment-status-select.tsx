"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePaymentStatus } from "@/lib/actions/admin";
import { PAYMENT_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

interface PaymentStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export function PaymentStatusSelect({
  orderId,
  currentStatus,
}: PaymentStatusSelectProps) {
  const router = useRouter();

  const handleChange = async (value: string) => {
    const result = await updatePaymentStatus(orderId, value);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Payment status updated");
      router.refresh();
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAYMENT_STATUSES.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
