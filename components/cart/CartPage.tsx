"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, selectCartQuantity, selectCartSubtotal } from "@/stores/cart-store";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalQuantity = useCartStore(selectCartQuantity);
  const subtotal = useCartStore(selectCartSubtotal);

  const total = subtotal;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
           <nav className="py-7 text-xs uppercase tracking-[0.12em] text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><span className="px-2">/</span><span className="text-foreground">Shopping cart</span></nav>
      <div className="mb-10 border-b border-border pb-8"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Your selection</p><h1 className="mt-3 font-serif text-4xl text-foreground sm:text-6xl">Shopping cart</h1><p className="mt-3 text-sm text-muted-foreground" aria-live="polite">{totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart</p></div>

      {items.length ? (
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px] xl:gap-16">
          <section aria-label="Cart items">
            <div className="hidden grid-cols-[1fr_110px_150px_100px] bg-[#d7ad61] px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#2e2117] sm:grid"><span>Product</span><span>Price</span><span>Quantity</span><span className="text-right">Subtotal</span></div>
            <div>
              {items.map((item) => (
                <article key={item.id} className="grid grid-cols-[88px_1fr_auto] gap-4 border-b border-border py-6 sm:grid-cols-[1fr_110px_150px_100px] sm:items-center sm:px-5">
                  <div className="contents sm:flex sm:items-center sm:gap-5">
                    <div className="relative aspect-square w-[88px] bg-muted"><Image src={item.image} alt={item.name} fill sizes="88px" className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal" /></div>
                    <div className="self-center"><Link href={`/products/${item.id}`} className="text-sm font-semibold text-foreground hover:text-brand sm:text-base">{item.name}</Link><p className="mt-2 text-xs text-muted-foreground">{item.category} · {item.material}</p><p className="mt-2 text-sm font-medium text-brand sm:hidden">${item.price.toFixed(2)}</p></div>
                  </div>
                  <p className="hidden text-sm text-foreground sm:block">${item.price.toFixed(2)}</p>
                  <div className="col-start-2 mt-2 inline-flex h-10 w-fit items-center border border-border sm:col-auto sm:mt-0"><button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`} className="grid h-full w-10 place-items-center hover:bg-muted"><FiMinus className="size-3" /></button><span className="grid h-full w-10 place-items-center border-x border-border text-sm">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`} className="grid h-full w-10 place-items-center hover:bg-muted"><FiPlus className="size-3" /></button></div>
                  <div className="col-start-3 row-start-1 flex h-full flex-col items-end justify-between sm:col-auto sm:row-auto sm:h-auto"><button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="text-muted-foreground transition hover:text-brand sm:hidden"><FiTrash2 /></button><p className="text-sm font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p><button type="button" onClick={() => removeItem(item.id)} className="mt-2 hidden text-xs text-muted-foreground underline hover:text-brand sm:block">Remove</button></div>
                </article>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={clearCart} className="w-fit text-sm text-foreground underline underline-offset-4 hover:text-brand">Clear shopping cart</button>
            </div>
          </section>

          <aside className="border border-border p-6 sm:p-8 lg:sticky lg:top-8" aria-labelledby="order-summary-title">
            <h2 id="order-summary-title" className="font-serif text-2xl text-foreground">Order summary</h2>
            <div className="mt-6 space-y-4 border-y border-border py-6 text-sm"><div className="flex justify-between text-muted-foreground"><span>Items</span><span>{totalQuantity}</span></div><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span></div><div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="text-foreground">Free</span></div><div className="flex justify-between text-muted-foreground"><span>Taxes</span><span className="text-foreground">Calculated at checkout</span></div></div>
            <div className="flex justify-between py-6 text-base font-semibold text-foreground"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <Link href="/submit-order" className="flex min-h-12 items-center justify-center bg-brand-solid px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-hover">Proceed to checkout</Link>
            <Link href="/products" className="mt-4 block text-center text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground">Continue shopping</Link>
          </aside>
        </div>
      ) : (
        <div className="grid min-h-[420px] place-items-center bg-secondary text-center"><div><FiShoppingBag className="mx-auto size-10 text-muted-foreground" /><h2 className="mt-5 font-serif text-3xl text-foreground">Your cart is empty</h2><p className="mt-3 text-sm text-muted-foreground">Discover something special to add to your collection.</p><Link href="/products" className="mt-7 inline-flex min-h-12 items-center bg-brand-solid px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white">Shop jewelry</Link></div></div>
      )}
    </main>
  );
}
