import Image from "next/image";
import Link from "next/link";

export default function LuxuryBanner() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-10" aria-labelledby="banner-title">
      <div className="relative min-h-[540px] overflow-hidden rounded-[2rem] sm:min-h-[620px]">
        <Image src="/images/luxury-banner.png" alt="Model wearing layered gold necklaces and a sculptural earring" fill sizes="(max-width: 1536px) 100vw, 1440px" className="object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 flex items-center px-7 sm:px-14 lg:px-20">
          <div className="max-w-xl text-white">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 sm:text-sm">The signature edit</p>
            <h2 id="banner-title" className="text-4xl font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl">Made to become part of your story</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/75 sm:text-lg">Enduring pieces, considered details, and effortless beauty—created to be worn for years to come.</p>
            <Link href="/products" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold uppercase tracking-[0.14em] text-stone-900 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Shop now</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
