"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const slides = [
  {
    image: "/images/hero-rings.png",
    eyebrow: "New collection",
    title: "Jewelry that feels like you",
    subtitle:
      "Thoughtfully designed pieces made to celebrate your everyday moments.",
    alt: "Sculptural gold rings arranged on warm limestone",
  },
  {
    image: "/images/hero-necklaces.png",
    eyebrow: "The fine edit",
    title: "A little light, worn daily",
    subtitle:
      "Delicate gold and diamond details made for effortless layering.",
    alt: "Fine gold necklaces displayed on flowing ivory silk",
  },
  {
    image: "/images/hero-earrings.png",
    eyebrow: "Modern essentials",
    title: "Timeless, with a new point of view",
    subtitle:
      "Sculptural silhouettes and polished finishes for every occasion.",
    alt: "Gold hoop earrings and bracelet on travertine forms",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((slide) => (slide + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 sm:py-8 lg:px-10"
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] bg-stone-200 sm:min-h-[620px] lg:min-h-[680px]">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === current ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={index !== current}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 1536px) 100vw, 1440px"
              className="object-cover object-[62%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#19130f]/75 via-[#19130f]/30 to-transparent sm:from-[#19130f]/65 sm:via-[#19130f]/10" />

            <div className="absolute inset-0 flex items-end px-7 pb-28 sm:items-center sm:px-14 sm:pb-0 lg:px-20">
              <div className="max-w-xl text-white">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-sm">
                  {slide.eyebrow}
                </p>
                <h1 className="max-w-lg text-4xl font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>
                <p className="mt-6 max-w-md text-base leading-7 text-white/85 sm:text-lg">
                  {slide.subtitle}
                </p>
                <Link
                  href="#shop"
                  className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold uppercase tracking-[0.14em] text-stone-900 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  tabIndex={index === current ? 0 : -1}
                >
                  Shop now
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-7 right-7 z-20 flex items-center gap-3 sm:bottom-10 sm:right-10">
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="grid size-12 place-items-center rounded-full border border-white/50 bg-black/10 text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-14"
            aria-label="Previous slide"
          >
            <FiArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            className="grid size-12 place-items-center rounded-full border border-white/50 bg-black/10 text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-14"
            aria-label="Next slide"
          >
            <FiArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="absolute bottom-9 left-7 z-20 flex gap-2 sm:bottom-12 sm:left-14 lg:left-20">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => goTo(index)}
              className={`h-1 rounded-full transition-all ${
                index === current ? "w-9 bg-white" : "w-4 bg-white/45 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
