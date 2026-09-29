"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeart } from "react-icons/fi";
import { PRODUCTS } from "@/lib/data/catalog";
import { useCartStore } from "@/stores/cart-store";
import { useAccount } from "./use-account";
import { AccountShell } from "./AccountShell";

export function WishlistButton({ productId, name, className }: { productId: number; name: string; className?: string }) {
  const { user, ready, data, updateData } = useAccount();
  const router = useRouter();
  const saved = data.wishlist.includes(productId);
  return <button type="button" disabled={!ready} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${name} ${saved ? "from" : "to"} wishlist`} className={className} onClick={() => { if (!user) { router.push("/auth/login"); return; } updateData(current => ({ ...current, wishlist: current.wishlist.includes(productId) ? current.wishlist.filter(id => id !== productId) : [...current.wishlist, productId] })); }}><FiHeart className={`size-4 ${saved ? "fill-current text-brand" : ""}`} aria-hidden="true" /></button>;
}

export default function WishlistPage() {
  const { data, updateData } = useAccount();
  const addItem = useCartStore(state => state.addItem);
  const products = PRODUCTS.filter(product => data.wishlist.includes(product.id));
  return <AccountShell title="My wishlist">
    {!products.length ? <div className="rounded-xl border border-dashed p-12 text-center"><FiHeart className="mx-auto size-9 text-brand" /><h2 className="mt-4 font-serif text-2xl">Keep your favorites close</h2><p className="mt-3 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p><Link href="/products" className="mt-6 inline-block text-brand underline">Explore jewelry</Link></div> : <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">{products.map(product => <article key={product.id} className="min-w-0"><Link href={`/products/${product.id}`}><div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted"><Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-5" /></div><h2 className="mt-4 text-sm font-medium">{product.name}</h2></Link><p className="mt-2 text-sm text-brand">${product.price.toFixed(2)}</p><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => addItem(product.id)} className="rounded-lg bg-brand-solid px-4 py-2 text-sm text-white hover:bg-brand-hover">Add to cart</button><button onClick={() => updateData(current => ({ ...current, wishlist: current.wishlist.filter(id => id !== product.id) }))} aria-label={`Remove ${product.name} from wishlist`} className="text-sm text-muted-foreground underline hover:text-destructive">Remove</button></div></article>)}</div>}
  </AccountShell>;
}
