import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/data/catalog";

export default function Footer() {
  return <footer className="border-t bg-secondary text-foreground">
    <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
      <div><Link href="/" className="font-serif text-3xl tracking-[0.18em]">LUMIÈRE</Link><p className="mt-5 text-sm leading-6 text-muted-foreground">A fine-jewelry storefront demo. Explore the collection and try the shopping experience.</p></div>
      <div><h2 className="text-sm font-semibold">Shop</h2><ul className="mt-5 space-y-3 text-sm text-muted-foreground"><li><Link href="/products" className="hover:text-foreground">All jewelry</Link></li>{PRODUCT_CATEGORIES.map(category => <li key={category}><Link href={"/products?category=" + encodeURIComponent(category)} className="hover:text-foreground">{category}</Link></li>)}</ul></div>
      <div><h2 className="text-sm font-semibold">Your account</h2><ul className="mt-5 space-y-3 text-sm text-muted-foreground">{[["/profile", "My profile"], ["/orders", "My orders"], ["/addresses", "Addresses"], ["/wishlist", "Wishlist"], ["/cart", "Shopping cart"]].map(([href, label]) => <li key={href}><Link href={href} className="hover:text-foreground">{label}</Link></li>)}</ul></div>
      <div><h2 className="text-sm font-semibold">About this demo</h2><p className="mt-5 text-sm leading-6 text-muted-foreground">No real payments or deliveries. Saved addresses, wishlist items, and demo orders stay in this browser, separately for each signed-in account.</p><Link href="/about-demo" className="mt-4 inline-block text-sm text-brand underline">How the demo works</Link></div>
    </div>
    <div className="border-t px-4 py-6 text-center text-xs text-muted-foreground">Lumière · Portfolio demo · Not a live retail store</div>
  </footer>;
}
