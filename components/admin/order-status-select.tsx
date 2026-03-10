"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/actions/admin";
import { ORDER_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const router = useRouter();

  const handleChange = async (value: string) => {
    const result = await updateOrderStatus(orderId, value);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Order status updated");
      router.refresh();
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="lg:w-[130px] w-full h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
