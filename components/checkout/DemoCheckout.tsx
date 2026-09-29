"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AddressBook } from "@/components/account/AddressesPage";
import { useAccount } from "@/components/account/use-account";
import { createDemoOrder } from "@/lib/account-data";
import { useCartStore, selectCartSubtotal } from "@/stores/cart-store";
import CheckoutProgress from "./CheckoutProgress";

export default function DemoCheckout({ step }: { step: 0 | 1 | 2 }) {
  const { user, data, updateData } = useAccount();
  const items = useCartStore(state => state.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore(state => state.clearCart);
  const address = data.addresses.find(item => item.id === data.selectedAddress);
  const taxes = Math.round(subtotal * 7) / 100;
  const total = subtotal + taxes;
  const router = useRouter();
  const placing = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  function placeOrder() {
    if (placing.current || !user || !address || !items.length) return;
    placing.current = true; setBusy(true); setError("");
    try {
      const order = createDemoOrder(items, address, crypto.randomUUID(), new Date().toISOString());
      if (!updateData(current => ({ ...current, orders: [order, ...current.orders] }))) throw new Error("Your order could not be saved. Please try again.");
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch (error) { placing.current = false; setBusy(false); setError(error instanceof Error ? error.message : "Could not place your order."); }
  }

  return <AccountShell title={["Delivery address", "Demo payment", "Review order"][step]}>
    {busy ? <p role="status" className="rounded-xl border p-10">Your demo order has been saved. Opening order details…</p> : !items.length ? <div className="rounded-xl border border-dashed p-10 text-center"><h2 className="font-serif text-2xl">Your cart is empty</h2><Link href="/products" className="mt-4 inline-block text-brand underline">Explore jewelry</Link></div> : <>
      <CheckoutProgress currentStep={step} />
      <p className="my-8 rounded-lg bg-brand-soft p-4 text-sm text-brand">This is a demo checkout. No payment will be taken and no items will be shipped.</p>
      <div className="grid items-start gap-8 xl:grid-cols-[1fr_280px]">
        <section className="min-w-0">
          {step === 0 && <AddressBook selectable />}
          {step > 0 && !address && <p role="alert" className="mb-6 text-sm text-destructive">Choose a delivery address before continuing. <Link href="/submit-order" className="underline">Add or select an address</Link></p>}
          {step === 1 && <div className="rounded-xl border bg-card p-6"><h2 className="font-serif text-2xl">Try the checkout experience</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">You can create a demo order and view it in your account. You don’t need to enter any card or payment details.</p><label className="mt-6 flex items-start gap-3 text-sm"><input type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} className="mt-0.5 size-4 accent-brand" />I understand this is a demo order.</label></div>}
          {step === 2 && <>
            <div className="divide-y rounded-xl border bg-card px-5">{items.map(item => <div key={item.id} className="flex gap-4 py-5"><div className="relative size-20 shrink-0 rounded-lg bg-muted"><Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" /></div><div className="min-w-0 flex-1"><Link href={`/products/${item.id}`} className="text-sm font-medium">{item.name}</Link><p className="mt-2 text-sm text-muted-foreground">Quantity: {item.quantity}</p><p className="mt-2 text-sm text-brand">${(item.price * item.quantity).toFixed(2)}</p></div></div>)}</div>
            {address && <div className="mt-5 rounded-xl border bg-card p-6"><div className="flex justify-between gap-3"><h2 className="font-semibold">Delivery address</h2><Link href="/submit-order" className="text-sm text-brand underline">Change</Link></div><p className="mt-3 text-sm leading-7 text-muted-foreground">{address.name}<br />{address.street}<br />{address.city}, {address.postalCode}<br />{address.country}<br />{address.phone}</p></div>}
          </>}
          {step > 0 && <Link href={step === 1 ? "/submit-order" : "/submit-order/payment"} className="mt-6 inline-block text-sm text-brand underline">← Back</Link>}
        </section>
        <aside className="rounded-xl border bg-card p-6"><h2 className="font-serif text-2xl">Order summary</h2><dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div><div className="flex justify-between"><dt>Demo tax (7%)</dt><dd>${taxes.toFixed(2)}</dd></div><div className="flex justify-between"><dt>Delivery</dt><dd>Free</dd></div><div className="flex justify-between border-t pt-4 font-semibold"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div></dl>
          <button disabled={!address || (step === 1 && !acknowledged)} onClick={() => step === 2 ? placeOrder() : router.push(step === 0 ? "/submit-order/payment" : "/submit-order/review")} className="mt-6 w-full rounded-lg bg-brand-solid px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50">{step === 2 ? "Place demo order" : "Continue"}</button>
          {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        </aside>
      </div>
    </>}
  </AccountShell>;
}
