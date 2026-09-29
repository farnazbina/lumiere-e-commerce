"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { searchProducts } from "@/lib/data/search";

export default function ProductSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const router = useRouter();
  const term = query.trim();
  const matches = term ? searchProducts(term) : [];
  const resultsHref = `/products?${new URLSearchParams({ q: term })}`;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button ref={trigger} type="button" aria-label="Search products" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className="flex min-h-11 min-w-11 items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition hover:text-gold">
        <FiSearch className="size-5 stroke-[1.5]" aria-hidden="true" />
        <span className="hidden lg:inline">Search</span>
      </button>
      {open && (
        <div id={panelId} className="absolute left-4 right-4 top-full z-50 mt-2 sm:left-auto sm:right-6 sm:w-[420px] lg:right-10">
          <form role="search" onSubmit={(event) => {
            event.preventDefault();
            if (!term) return;
            setOpen(false);
            router.push(resultsHref);
          }} className="flex items-center border border-border bg-card p-2 shadow-lg">
            <label htmlFor={`${panelId}-input`} className="sr-only">Search products by name</label>
            <input id={`${panelId}-input`} autoFocus type="search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jewelry by name..." className="min-w-0 flex-1 bg-card px-3 py-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-gold" />
            <button type="submit" aria-label="Show all search results" disabled={!term} className="grid size-11 shrink-0 place-items-center disabled:opacity-40"><FiSearch /></button>
            <button type="button" aria-label="Close search" onClick={() => { setOpen(false); trigger.current?.focus(); }} className="grid size-11 shrink-0 place-items-center"><FiX /></button>
          </form>
          {term && (
            <div className="mt-2 max-h-[65dvh] overflow-y-auto border border-border bg-card shadow-xl">
              <p role="status" className="px-4 pt-4 text-xs text-muted-foreground">{matches.length ? `${matches.length} matching product${matches.length === 1 ? "" : "s"}` : "No products found. Try another name."}</p>
              <ul className="p-2">
                {matches.slice(0, 3).map((product) => (
                  <li key={product.id}>
                    <Link href={`/products/${product.id}`} onClick={() => setOpen(false)} className="flex items-center gap-4 p-2 transition hover:bg-secondary focus-visible:bg-secondary">
                      <Image src={product.image} alt={product.name} width={64} height={64} className="size-16 object-contain" />
                      <span className="min-w-0"><span className="block text-sm font-medium text-foreground">{product.name}</span><span className="mt-1 block text-sm text-brand">${product.price.toFixed(2)}</span></span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={resultsHref} onClick={() => setOpen(false)} className="block border-t border-border px-4 py-4 text-center text-sm font-semibold text-brand hover:bg-secondary">See all results{matches.length > 0 ? ` (${matches.length})` : ""}</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
