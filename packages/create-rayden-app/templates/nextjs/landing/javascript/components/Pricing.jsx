"use client";

import { Button, Badge, Icon } from "@raydenui/ui";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for side projects and learning.",
    features: [
      "All core components",
      "Community support",
      "Basic documentation",
      "MIT License",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For professional teams building production apps.",
    features: [
      "Everything in Starter",
      "Premium components",
      "Priority support",
      "Figma design files",
      "Early access to new features",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with specific requirements.",
    features: [
      "Everything in Pro",
      "Custom components",
      "Dedicated support",
      "SLA guarantee",
      "Training sessions",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-grey-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-grey-600">
            Choose the plan that works best for your team.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                tier.featured
                  ? "bg-grey-900 text-white ring-2 ring-primary-500"
                  : "bg-white ring-1 ring-grey-200"
              }`}
            >
              {tier.featured && (
                <Badge color="orange" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <h3 className={`text-xl font-semibold ${tier.featured ? "text-white" : "text-grey-900"}`}>
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${tier.featured ? "text-white" : "text-grey-900"}`}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span className={tier.featured ? "text-grey-300" : "text-grey-500"}>
                    {tier.period}
                  </span>
                )}
              </div>
              <p className={`mt-4 ${tier.featured ? "text-grey-300" : "text-grey-600"}`}>
                {tier.description}
              </p>
              <ul className="mt-8 space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Icon
                      name="check"
                      size="sm"
                      className={tier.featured ? "text-primary-400" : "text-primary-500"}
                    />
                    <span className={tier.featured ? "text-grey-200" : "text-grey-700"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                variant={tier.featured ? "primary" : "grey"}
                appearance={tier.featured ? "solid" : "outlined"}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
