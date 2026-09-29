"use client";

import { WishlistButton } from "@/components/account/WishlistPage";

import { useCartStore } from "@/stores/cart-store";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/data/catalog";
import ShopFilters from "./ShopFilters";
import { searchProducts } from "@/lib/data/search";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiFilter,
  FiGrid,
  FiList,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";

const products = PRODUCTS;
const categories = PRODUCT_CATEGORIES;

export default function ShopCatalog({ initialCategory }: { initialCategory?: string }) {
  const addItem = useCartStore((state) => state.addItem);
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const clearSearchParams = new URLSearchParams(searchParams.toString());
  clearSearchParams.delete("q");
  const clearSearchHref = `/products${clearSearchParams.size ? `?${clearSearchParams}` : ""}`;
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory && categories.some((category) => category === initialCategory)
      ? [initialCategory]
      : [],
  );
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setSelectedCategories(
      categoryFromUrl && categories.some((category) => category === categoryFromUrl)
        ? [categoryFromUrl]
        : [],
    );
  }, [categoryFromUrl]);

  const toggleCategory = (category: string) => setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  const visibleProducts = useMemo(() => {
    const filtered = searchProducts(searchQuery).filter((product) => product.price <= maxPrice && (!selectedCategories.length || selectedCategories.includes(product.category)));
    return [...filtered].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "name" ? a.name.localeCompare(b.name) : a.id - b.id);
  }, [maxPrice, selectedCategories, sort, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
      <nav className="py-7 text-xs uppercase tracking-[0.12em] text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><span className="px-2">/</span><span className="text-foreground">Shop</span></nav>
      <header className="border-b border-border pb-10 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Our collection</p><h1 className="mt-3 font-serif text-4xl text-foreground sm:text-6xl">Shop all jewelry</h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Discover timeless pieces designed for every day, every occasion, and every story.</p></header>

      {searchQuery && <div className="mt-6 flex flex-wrap items-center gap-3 text-sm" role="status"><p>Search results for <strong className="break-all">“{searchQuery}”</strong></p><Link href={clearSearchHref} className="text-brand underline underline-offset-4">Clear search</Link></div>}

      <div className="grid gap-10 pt-9 lg:grid-cols-[220px_1fr] xl:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block"><ShopFilters selected={selectedCategories} onToggle={toggleCategory} maxPrice={maxPrice} onPriceChange={setMaxPrice} /></aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={`grid size-10 place-items-center border transition ${view === "grid" ? "border-brand bg-brand-solid text-white" : "border-border text-muted-foreground hover:border-foreground"}`}
              >
                <FiGrid />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
                className={`grid size-10 place-items-center border transition ${view === "list" ? "border-brand bg-brand-solid text-white" : "border-border text-muted-foreground hover:border-foreground"}`}
              >
                <FiList />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Showing {visibleProducts.length} of {products.length} results</p>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={() => setMobileFilters(true)} className="inline-flex min-h-11 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.1em] lg:hidden"><FiFilter />Filters</button>
              <label className="relative"><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 appearance-none border border-border bg-card pl-4 pr-10 text-xs font-semibold uppercase tracking-[0.08em] outline-none"><option value="featured">Sort by featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name</option></select><FiChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" /></label>
            </div>
          </div>

          {visibleProducts.length ? <div className={view === "grid" ? "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-6" : "grid grid-cols-1 gap-5"}>
            {visibleProducts.map((product, index) => <article key={product.id} className={`group ${view === "list" ? "flex gap-5 border-b border-border pb-5 sm:gap-8" : ""}`}>
              <div className={`relative shrink-0 overflow-hidden bg-muted ${view === "list" ? "aspect-square w-36 sm:w-56" : "aspect-[4/5] w-full"}`}>
                <Link href={`/products/${product.id}`} className="absolute inset-0"><Image src={product.image} alt={product.name} fill loading={index < 3 ? "eager" : "lazy"} sizes="(max-width: 768px) 50vw, 33vw" className="object-contain p-5 mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105" /></Link>
                <WishlistButton productId={product.id} name={product.name} className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-card text-foreground sm:opacity-0 shadow-sm transition group-hover:opacity-100 focus:opacity-100" />
                {view === "grid" && <button type="button" onClick={() => addItem(product.id)} className="absolute bottom-3 left-3 right-3 flex min-h-11 translate-y-2 items-center justify-center gap-2 bg-brand-solid text-xs font-semibold uppercase tracking-[0.1em] text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"><FiShoppingBag />Add to cart</button>}
              </div>
              <div className={view === "list" ? "flex flex-1 flex-col justify-center py-2" : ""}>
                <Link href={`/products/${product.id}`} className={view === "grid" ? "mt-4 block" : "block"}><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{product.category}</p><h2 className={`mt-2 font-medium text-foreground ${view === "list" ? "text-lg sm:text-2xl" : "text-sm sm:text-base"}`}>{product.name}</h2><p className="mt-2 text-sm font-medium text-brand">${product.price.toFixed(2)}</p></Link>
                {view === "list" && <><p className="mt-4 hidden max-w-xl text-sm leading-6 text-muted-foreground sm:block">A refined everyday piece crafted with thoughtful proportions and a luminous, polished finish.</p><button type="button" onClick={() => addItem(product.id)} className="mt-5 flex min-h-11 w-fit items-center justify-center gap-2 bg-brand-solid px-6 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-brand-hover"><FiShoppingBag />Add to cart</button></>}
              </div>
            </article>)}
          </div> : <div className="grid min-h-80 place-items-center bg-secondary text-center"><div><p className="text-lg font-medium">No pieces match your filters.</p><button onClick={() => { setSelectedCategories([]); setMaxPrice(500); }} className="mt-3 text-sm underline">Clear filters</button></div></div>}
        </div>
      </div>

      {mobileFilters && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close filters" className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} /><aside className="absolute bottom-0 right-0 top-0 w-[min(88vw,380px)] overflow-y-auto bg-card p-6"><div className="mb-8 flex items-center justify-between"><h2 className="font-serif text-2xl">Filters</h2><button onClick={() => setMobileFilters(false)} aria-label="Close filters" className="grid size-10 place-items-center"><FiX className="size-5" /></button></div><ShopFilters selected={selectedCategories} onToggle={toggleCategory} maxPrice={maxPrice} onPriceChange={setMaxPrice} /><button onClick={() => setMobileFilters(false)} className="mt-10 min-h-12 w-full bg-brand-solid text-sm font-semibold uppercase tracking-[0.12em] text-white">Show {visibleProducts.length} products</button></aside></div>}
    </div>
  );
}
