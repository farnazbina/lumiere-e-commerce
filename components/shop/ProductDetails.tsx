"use client";

import { WishlistButton } from "@/components/account/WishlistPage";

import { useCartStore } from "@/stores/cart-store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProduct, PRODUCTS, PRODUCT_GALLERY_FALLBACKS } from "@/lib/data/catalog";
import { useMemo, useState } from "react";
import { FiMinus, FiPlus, FiShoppingBag, FiStar } from "react-icons/fi";

export default function ProductDetails({ productId }: { productId: string }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const product = getProduct(productId) ?? PRODUCTS[0];
  const images = useMemo(() => [product.image, ...PRODUCT_GALLERY_FALLBACKS.filter((image) => image !== product.image)].slice(0, 4), [product.image]);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [activeTab, setActiveTab] = useState<"description" | "details" | "shipping">("description");

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setOrigin(`${((event.clientX - bounds.left) / bounds.width) * 100}% ${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
      <nav className="py-7 text-xs uppercase tracking-[0.12em] text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><span className="px-2">/</span><Link href="/products">Shop</Link><span className="px-2">/</span><span className="text-foreground">{product.name}</span></nav>

      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:gap-24">
        <div>
          <div
            className={`relative aspect-square overflow-hidden bg-muted ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <Image src={selectedImage} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-contain p-10 mix-blend-multiply dark:mix-blend-normal transition-transform duration-200 ease-out sm:p-16" style={{ transform: zoomed ? "scale(2.15)" : "scale(1)", transformOrigin: origin }} />
            <span className="pointer-events-none absolute bottom-4 right-4 bg-card/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Hover to zoom</span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image, index) => <button key={image} type="button" onClick={() => setSelectedImage(image)} aria-label={`Show product image ${index + 1}`} aria-pressed={selectedImage === image} className={`relative aspect-square overflow-hidden bg-muted transition ${selectedImage === image ? "ring-2 ring-brand ring-offset-2 ring-offset-background" : "hover:ring-1 hover:ring-ring"}`}><Image src={image} alt="" fill sizes="15vw" className="object-contain p-3 mix-blend-multiply dark:mix-blend-normal" /></button>)}
          </div>
        </div>

        <section className="pt-2 lg:sticky lg:top-8 lg:h-fit" aria-labelledby="product-title">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{product.category}</p>
          <h1 id="product-title" className="mt-4 font-serif text-4xl tracking-[-0.025em] text-foreground sm:text-5xl">{product.name}</h1>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, index) => <FiStar key={index} className="size-4 fill-current" />)}</div>
            <span className="text-xs text-muted-foreground">Sample rating</span>
          </div>
          <p className="mt-7 text-2xl font-medium text-brand">${product.price.toFixed(2)}</p>
          <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground">A timeless expression of modern elegance, thoughtfully crafted in polished 18k gold. Designed with graceful proportions and a luminous finish for effortless everyday wear.</p>

          <div className="mt-8 border-t border-border pt-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Quantity</p>
            <div className="inline-flex h-12 items-center border border-border"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" className="grid h-full w-12 place-items-center hover:bg-muted"><FiMinus /></button><span className="grid h-full w-12 place-items-center border-x border-border text-sm">{quantity}</span><button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity" className="grid h-full w-12 place-items-center hover:bg-muted"><FiPlus /></button></div>
          </div>

          <div className="mt-8 flex gap-3"><button type="button" onClick={() => addItem(product.id, quantity)} className="flex min-h-14 flex-1 items-center justify-center gap-3 bg-brand-solid px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-hover"><FiShoppingBag />Add to cart</button><WishlistButton productId={product.id} name={product.name} className="grid size-14 shrink-0 place-items-center border border-border transition hover:border-brand hover:bg-brand-solid hover:text-white" /></div>
          <button type="button" onClick={() => { addItem(product.id, quantity); router.push("/submit-order"); }} className="mt-3 min-h-14 w-full border border-foreground text-sm font-semibold uppercase tracking-[0.12em] text-foreground transition hover:bg-stone-900 hover:text-white">Try demo checkout</button>
          <div className="mt-7 grid grid-cols-3 border-y border-border py-5 text-center text-xs text-muted-foreground"><span>Demo catalog</span><span className="border-x border-border">No shipping</span><span>No payment</span></div>
        </section>
      </div>

      <section className="mt-20 border-y border-border sm:mt-28">
        <div className="flex gap-7 overflow-x-auto sm:gap-12">{(["description", "details", "shipping"] as const).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`border-b-2 py-5 text-xs font-semibold uppercase tracking-[0.12em] ${activeTab === tab ? "border-brand text-brand" : "border-transparent text-muted-foreground"}`}>{tab === "details" ? "Product details" : tab}</button>)}</div>
        <div className="max-w-4xl py-8 text-sm leading-7 text-muted-foreground">{activeTab === "description" && <p>Designed to move naturally with you, this piece balances a clean contemporary silhouette with enduring craftsmanship. Each surface is carefully polished by hand for a rich, luminous finish.</p>}{activeTab === "details" && <p>Material: 18k gold · Finish: high polish · Responsibly sourced materials · Presented in our signature keepsake box.</p>}{activeTab === "shipping" && <p>This is a portfolio demo. Orders are saved in this browser only; no payment, shipping, or returns take place.</p>}</div>
      </section>

      <section className="mt-20" aria-labelledby="related-title"><h2 id="related-title" className="font-serif text-3xl text-foreground sm:text-4xl">You may also like</h2><div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">{PRODUCTS.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <Link key={item.id} href={`/products/${item.id}`} className="group"><div className="relative aspect-[4/5] bg-muted"><Image src={item.image} alt={item.name} fill sizes="25vw" className="object-contain p-6 mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105" /></div><h3 className="mt-4 text-sm font-medium sm:text-base">{item.name}</h3><p className="mt-1 text-sm text-brand">${item.price.toFixed(2)}</p></Link>)}</div></section>
    </main>
  );
}
