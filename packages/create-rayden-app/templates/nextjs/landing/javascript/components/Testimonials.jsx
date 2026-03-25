"use client";

import { Avatar } from "@raydenui/ui";

const testimonials = [
  {
    quote: "This component library has completely transformed how we build products. The quality and attention to detail is exceptional.",
    author: "Sarah Chen",
    role: "CTO at TechStart",
    initials: "SC",
  },
  {
    quote: "We shipped our MVP in half the time thanks to these pre-built components. The TypeScript support is fantastic.",
    author: "Marcus Johnson",
    role: "Lead Developer at AppFlow",
    initials: "MJ",
  },
  {
    quote: "The design system is so well thought out. Our entire team can now build consistent UIs without constant back-and-forth.",
    author: "Emily Rodriguez",
    role: "Design Lead at Creative Co",
    initials: "ER",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-grey-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loved by developers
          </h2>
          <p className="mt-4 text-lg text-grey-300">
            See what teams are saying about building with our components.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="flex flex-col justify-between rounded-2xl bg-grey-800 p-8"
            >
              <p className="text-lg text-grey-100 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Avatar initials={testimonial.initials} size="md" />
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-grey-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
