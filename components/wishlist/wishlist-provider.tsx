"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  getWishlist,
  syncGuestWishlist,
} from "@/app/actions/wishlist";

const STORAGE_KEY = "elita-wishlist";

interface WishlistContextType {
  items: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  isWishlisted: () => false,
  toggleWishlist: async () => {},
  itemCount: 0,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Load wishlist on mount
  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        // Check for guest wishlist to sync
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const guestIds: string[] = JSON.parse(stored);
          if (guestIds.length > 0) {
            await syncGuestWishlist(guestIds);
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        // Fetch DB wishlist
        const { items: dbItems } = await getWishlist();
        setItems(dbItems);
      } else {
        // Guest: use localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      }
    }
    init();
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => items.includes(productId),
    [items],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const alreadyWishlisted = items.includes(productId);

      if (userId) {
        // Logged-in user: use DB
        if (alreadyWishlisted) {
          setItems((prev) => prev.filter((id) => id !== productId));
          await removeFromWishlistAction(productId);
        } else {
          setItems((prev) => [...prev, productId]);
          await addToWishlistAction(productId);
        }
      } else {
        // Guest: use localStorage
        let updated: string[];
        if (alreadyWishlisted) {
          updated = items.filter((id) => id !== productId);
        } else {
          updated = [...items, productId];
        }
        setItems(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    },
    [items, userId],
  );

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggleWishlist, itemCount: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
