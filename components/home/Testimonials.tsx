"use client";

import Image from "next/image";
import { useRef } from "react";
import { FiArrowLeft, FiArrowRight, FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Amelia Hart",
    avatar: "/images/testimonials/amelia.png",
    title: "Luxury and elegance in every piece!",
    quote: "The attention to detail in every piece is breathtaking—truly a work of art.",
    rating: 5,
  },
  {
    name: "Claire Bennett",
    avatar: "/images/testimonials/claire.png",
    title: "Perfect gift for my loved ones!",
    quote: "The intricate details and premium finish make every piece a memorable keepsake.",
    rating: 5,
  },
  {
    name: "Sophia Moreno",
    avatar: "/images/testimonials/sophia.png",
    title: "Timeless pieces I wear every day!",
    quote: "Beautifully made, comfortable, and even more luminous in person than I imagined.",
    rating: 5,
  },
];

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="overflow-hidden bg-secondary py-20 sm:py-28"
      aria-labelledby="testimonials-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex items-center justify-between sm:mb-14">
          <h2
            id="testimonials-title"
            className="font-serif text-3xl font-normal tracking-[-0.03em] text-foreground sm:text-5xl"
          >
            Testimonials
          </h2>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous testimonials"
              className="grid size-11 place-items-center rounded-full border border-border text-foreground transition hover:border-brand hover:bg-brand-solid hover:text-white"
            >
              <FiArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next testimonials"
              className="grid size-11 place-items-center rounded-full bg-brand-solid text-white transition hover:bg-brand-hover"
            >
              <FiArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="-mr-4 flex snap-x snap-mandatory gap-5 overflow-x-auto pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mr-6 sm:pr-6 lg:-mr-[calc((100vw-1360px)/2)] lg:pr-[calc((100vw-1360px)/2)]"
          aria-label="Customer testimonials"
        >
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="flex min-h-64 w-[88%] shrink-0 snap-start flex-col border border-border bg-card p-6 sm:min-h-72 sm:w-[70%] sm:p-8 lg:w-[47%]"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
                <p className="text-sm font-medium text-foreground">
                  {testimonial.name}
                </p>
              </div>

              <h3 className="mt-6 font-serif text-2xl leading-tight tracking-[-0.025em] text-foreground sm:text-3xl">
                &quot;{testimonial.title}&quot;
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {testimonial.quote}
              </p>

              <div
                className="mt-auto flex gap-1 pt-6 text-brand"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: testimonial.rating }).map((_, star) => (
                  <FiStar
                    key={star}
                    className="size-4 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
