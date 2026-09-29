"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, selectCartQuantity, selectCartSubtotal } from "@/stores/cart-store";
import { useEffect } from "react";
import { FiMinus, FiPlus, FiTrash2, FiX } from "react-icons/fi";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalQuantity = useCartStore(selectCartQuantity);
  const subtotal = useCartStore(selectCartSubtotal);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  return (
    <div
      className={`fixed inset-0 z-[100] transition-visibility duration-300 ${
        open ? "visible" : "invisible"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close shopping cart"
        onClick={onClose}
        className={`absolute inset-0 bg-stone-950/45 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        tabIndex={open ? 0 : -1}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute bottom-0 left-0 right-0 flex max-h-[85dvh] flex-col rounded-t-[1.75rem] bg-card shadow-2xl transition-transform duration-300 ease-out lg:bottom-auto lg:left-auto lg:top-0 lg:h-full lg:max-h-none lg:w-[440px] lg:rounded-none ${
          open
            ? "translate-y-0 lg:translate-x-0"
            : "translate-y-full lg:translate-x-full lg:translate-y-0"
        }`}
      >
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-border lg:hidden" />
        <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-7 lg:py-6">
          <div>
            <h2 id="cart-title" className="font-serif text-2xl text-foreground">
              Your cart
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              You have {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="grid size-10 place-items-center rounded-full transition hover:bg-muted"
          >
            <FiX className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7">
          {cartItems.length === 0 && <div className="py-16 text-center"><p className="font-serif text-2xl">Your cart is empty</p><Link href="/products" onClick={onClose} className="mt-4 inline-block text-sm text-brand underline">Shop jewelry</Link></div>}
          {cartItems.map((item) => (
            <article
              key={item.id}
              className="grid grid-cols-[88px_1fr_auto] gap-4 border-b border-border py-5"
            >
              <Link
                href={`/products/${item.id}`}
                onClick={onClose}
                className="relative aspect-square overflow-hidden bg-muted"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="88px"
                  className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                />
              </Link>
              <div>
                <Link
                  href={`/products/${item.id}`}
                  onClick={onClose}
                  className="text-sm font-medium text-foreground hover:text-brand"
                >
                  {item.name}
                </Link>
                <p className="mt-2 text-sm font-semibold text-brand">
                  ${item.price.toFixed(2)}
                </p>
                <div className="mt-3 inline-flex h-8 items-center border border-border">
                  <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`} className="grid h-full w-8 place-items-center hover:bg-muted"><FiMinus className="size-3" /></button>
                  <span className="grid h-full w-8 place-items-center border-x border-border text-xs">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`} className="grid h-full w-8 place-items-center hover:bg-muted"><FiPlus className="size-3" /></button>
                </div>
              </div>
              <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="grid size-8 place-items-center text-muted-foreground transition hover:text-brand"><FiTrash2 className="size-4" /></button>
            </article>
          ))}
        </div>

        <div className="border-t border-border bg-card p-5 sm:p-7">
          <div className="flex items-center justify-between text-sm font-semibold text-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Taxes and shipping calculated at checkout.
          </p>
          <div className="mt-5 grid gap-3">
            <Link href="/cart" onClick={onClose} className="flex min-h-12 items-center justify-center border border-brand text-xs font-semibold uppercase tracking-[0.12em] text-brand transition hover:bg-brand-solid hover:text-white">View cart</Link>
            {cartItems.length > 0 && <Link href="/submit-order" onClick={onClose} className="flex min-h-12 items-center justify-center bg-brand-solid text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-hover">Checkout</Link>}
          </div>
        </div>
      </aside>
    </div>
  );
}
