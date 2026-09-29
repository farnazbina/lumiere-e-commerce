"use client";

import { WishlistButton } from "@/components/account/WishlistPage";

import { PRODUCTS } from "@/lib/data/catalog";
import { useCartStore } from "@/stores/cart-store";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";

const products = PRODUCTS.slice(0, 4);

export default function BestSellers() {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-6 sm:px-6 sm:pb-28 lg:px-10" aria-labelledby="best-sellers-title">
      <div className="mb-10 flex items-end justify-between gap-5 sm:mb-14">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Most loved</p>
          <h2 id="best-sellers-title" className="text-3xl font-medium tracking-[-0.03em] text-foreground sm:text-5xl">Best sellers</h2>
        </div>
        <Link href="/products" className="group inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-foreground">View all <FiArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <article key={product.name} className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white">
              <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`} className="absolute inset-0 z-10">
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-contain p-5 mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105 sm:p-8" />
              </Link>
              <WishlistButton productId={product.id} name={product.name} className="absolute right-3 top-3 z-20 grid size-10 sm:translate-y-2 place-items-center rounded-full bg-card text-foreground sm:opacity-0 shadow-sm transition-all hover:bg-stone-900 hover:text-white group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 sm:right-5 sm:top-5" />
              <button type="button" onClick={() => addItem(product.id)} className="absolute bottom-3 left-3 right-3 z-20 flex min-h-12 translate-y-3 items-center justify-center gap-2 rounded-full bg-stone-900 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white opacity-0 transition-all hover:bg-stone-700 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 sm:bottom-5 sm:left-5 sm:right-5 sm:text-sm"><FiShoppingBag className="size-4" aria-hidden="true" />Add to cart</button>
            </div>
            <Link href={`/products/${product.id}`} className="mt-4 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900">
              <h3 className="text-sm font-medium text-foreground sm:text-base">{product.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
