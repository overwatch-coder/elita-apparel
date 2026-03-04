"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types/database";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { validateDiscountCode } from "@/lib/actions/discounts";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  discountCode: string;
  discountPercentage: number;
  setDiscount: (code: string, percentage: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "elita-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const {
          items: storedItems,
          discountCode: storedCode,
          discountPercentage: storedPercent,
        } = JSON.parse(stored);
        if (storedItems) setItems(storedItems);
        if (storedCode) setDiscountCode(storedCode);
        if (storedPercent) setDiscountPercentage(storedPercent);
      }
    } catch {
      // Handle legacy format or errors
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored));
      } catch {}
    }
    setIsHydrated(true);
  }, []);

  const searchParams = useSearchParams();

  // Persist cart to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items, discountCode, discountPercentage }),
      );
    }
  }, [items, isHydrated, discountCode, discountPercentage]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product_id === newItem.product_id && item.size === newItem.size,
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + newItem.quantity;

        if (newQty > existing.stock_quantity) {
          toast.error("Not enough stock available");
          return prev;
        }

        updated[existingIndex] = { ...existing, quantity: newQty };
        toast.success(`Updated ${newItem.name} quantity`);
        return updated;
      }

      if (newItem.quantity > newItem.stock_quantity) {
        toast.error("Not enough stock available");
        return prev;
      }

      toast.success(`${newItem.name} added to cart`);
      return [...prev, newItem];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product_id === productId && item.size === size),
      ),
    );
    toast.info("Item removed from cart");
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size);
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (item.product_id === productId && item.size === size) {
            if (quantity > item.stock_quantity) {
              toast.error("Not enough stock available");
              return item;
            }
            return { ...item, quantity };
          }
          return item;
        }),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscountCode("");
    setDiscountPercentage(0);
    toast.info("Cart cleared");
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const discounted = item.price * (1 - item.discount_percentage / 100);
    return sum + discounted * item.quantity;
  }, 0);

  const setDiscount = useCallback((code: string, percentage: number) => {
    setDiscountCode(code);
    setDiscountPercentage(percentage);
  }, []);

  // Auto-apply discount from URL
  useEffect(() => {
    if (!isHydrated) return;

    const codeFromUrl =
      searchParams?.get("coupon") || searchParams?.get("discount");

    if (codeFromUrl && codeFromUrl.toUpperCase() !== discountCode) {
      const applyUrlCode = async () => {
        try {
          const result = await validateDiscountCode(codeFromUrl);
          if (result.percentage) {
            setDiscount(codeFromUrl.toUpperCase(), result.percentage);
            toast.success(
              `Coupon "${codeFromUrl.toUpperCase()}" applied from link!`,
            );
          } else if (result.error) {
            console.warn("Invalid coupon in URL:", result.error);
          }
        } catch (err) {
          console.error("Failed to validate link coupon:", err);
        }
      };

      applyUrlCode();
    }
  }, [searchParams, isHydrated, discountCode, setDiscount]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        discountCode,
        discountPercentage,
        setDiscount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
