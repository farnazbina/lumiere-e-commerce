import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const categories = [
  { name: "Rings", href: "/products?category=Rings", image: "/images/categories/rings.png" },
  { name: "Earrings", href: "/products?category=Earrings", image: "/images/categories/earrings.png" },
  { name: "Bracelets", href: "/products?category=Bracelets", image: "/images/categories/bracelets.png" },
  { name: "Pendants", href: "/products?category=Pendants", image: "/images/categories/pendants.png" },
  { name: "Necklaces", href: "/products?category=Necklaces", image: "/images/categories/necklaces.png" },
];

export default function Categories() {
  return (
    <section id="shop" className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-10" aria-labelledby="categories-title">
      <div className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Shop by category</p>
          <h2 id="categories-title" className="text-3xl font-medium tracking-[-0.03em] text-foreground sm:text-5xl">Find your next favorite</h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-6 text-muted-foreground md:block">Everyday essentials and distinctive pieces, designed to be worn your way.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <Link key={category.name} href={category.href} className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border bg-card">
              <Image src={category.image} alt={`${category.name} collection`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" className="object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-border bg-card/90 text-foreground transition-all duration-300 group-hover:border-foreground group-hover:bg-stone-900 group-hover:text-white">
                <FiArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium tracking-[-0.02em] text-foreground sm:text-xl">{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
