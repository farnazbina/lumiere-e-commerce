"use client";

import Link from "next/link";
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useCartStore, selectCartQuantity } from "@/stores/cart-store";
import ProductSearch from "./ProductSearch";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  FiHeart,
  FiMenu,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

const navItems = [
  { label: "Rings", href: "/products?category=Rings" },
  { label: "Earrings", href: "/products?category=Earrings" },
  { label: "Bracelets", href: "/products?category=Bracelets" },
  { label: "Pendants", href: "/products?category=Pendants" },
  { label: "Necklaces", href: "/products?category=Necklaces" },
];

export default function Header() {
  const totalQuantity = useCartStore(selectCartQuantity);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="relative z-40 border-b border-border bg-secondary text-foreground">
      <div className="bg-brand-solid px-4 py-2 text-center text-xs text-white">Portfolio demo · No payments or deliveries. <Link href="/about-demo" className="underline underline-offset-2">Learn more</Link></div>

      <div className="mx-auto grid min-h-20 w-full max-w-[1536px] grid-cols-[auto_minmax(0,1fr)_auto] items-center px-4 sm:grid-cols-[1fr_auto_1fr] sm:px-6 lg:min-h-[110px] lg:px-10">
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.11em] transition hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-9 place-items-center justify-self-start sm:size-11 xl:hidden"
        >
          <FiMenu className="size-5" aria-hidden="true" />
        </button>

        <Link
          href="/"
          className="group text-center text-foreground"
          aria-label="Lumière Fine Jewelry home"
        >
          <span className="block text-lg leading-none text-gold transition group-hover:rotate-12 sm:text-xl">
            ◇
          </span>
          <span className="mt-1 block font-serif text-lg tracking-[0.12em] sm:text-3xl sm:tracking-[0.22em] lg:text-[2rem]">
            LUMIÈRE
          </span>
          <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.42em] sm:block">
            Fine Jewelry
          </span>
        </Link>

        <div className="flex items-center justify-self-end lg:gap-3 xl:gap-4">
          <ThemeSwitcher />
          <ProductSearch />
          <Link href="/profile" className="group hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition hover:text-gold lg:flex">
            <FiUser className="size-5 stroke-[1.5]" aria-hidden="true" />
            Account
          </Link>
          <Link href="/wishlist" className="group hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition hover:text-gold xl:flex">
            <FiHeart className="size-5 stroke-[1.5]" aria-hidden="true" />
            Wishlist
          </Link>
          <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open shopping cart, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`} className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition hover:text-gold">
            <span className="relative p-2"><FiShoppingBag className="size-5 stroke-[1.5]" aria-hidden="true" /><span aria-live="polite" aria-atomic="true" className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-solid px-1 text-[10px] text-white">{totalQuantity}</span></span>
            <span className="hidden lg:inline">Cart</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border px-4 py-5 xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-[1536px] gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-border py-4 text-xs font-semibold uppercase tracking-[0.12em] last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-6">
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 text-xs font-semibold uppercase"><FiUser />Account</Link>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 text-xs font-semibold uppercase"><FiHeart />Wishlist</Link>
            </div>
          </div>
        </nav>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
