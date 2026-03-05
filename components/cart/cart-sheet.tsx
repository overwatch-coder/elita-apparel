"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice, calculateDiscountedPrice } from "@/lib/constants";

export function CartSheet() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    isOpen,
    setIsOpen,
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg p-6">
        <SheetHeader className="px-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-xl">
              Your Cart ({totalItems})
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
            <div>
              <p className="font-serif text-lg">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Discover our premium African fashion collection
              </p>
            </div>
            <SheetClose asChild>
              <Button asChild className="bg-gold hover:bg-gold-dark text-white">
                <Link href="/shop">Shop Now</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6">
              <div className="space-y-6 py-4 px-6">
                {items.map((item) => {
                  const discountedPrice = calculateDiscountedPrice(
                    item.price,
                    item.discount_percentage,
                  );

                  return (
                    <div
                      key={`${item.product_id}-${item.size}`}
                      className="flex gap-4 group"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-cream-dark border border-border/50">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-0.5">
                        <div>
                          <h4 className="font-medium text-sm leading-tight hover:text-gold transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
                            Size: {item.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full border-border/60 hover:border-gold hover:text-gold"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.size,
                                  item.quantity - 1,
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full border-border/60 hover:border-gold hover:text-gold"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.size,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gold">
                              {formatPrice(discountedPrice * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5"
                              onClick={() =>
                                removeItem(item.product_id, item.size)
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Subtotal</span>
                <span className="text-lg font-bold text-gold">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping calculated at checkout
              </p>
              <div className="grid gap-2">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full bg-gold hover:bg-gold-dark text-white font-medium"
                  >
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
