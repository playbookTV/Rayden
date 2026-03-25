import { Icon } from "@raydenui/ui";

const features = [
  {
    name: "Modern Components",
    description: "Pre-built, accessible components that follow best practices and design standards.",
    icon: "grid",
  },
  {
    name: "Design Tokens",
    description: "Consistent design language with customizable colors, typography, and spacing.",
    icon: "palette",
  },
  {
    name: "TypeScript Ready",
    description: "Full TypeScript support with comprehensive type definitions for all components.",
    icon: "code",
  },
  {
    name: "Dark Mode",
    description: "Built-in dark mode support with automatic system preference detection.",
    icon: "moon",
  },
  {
    name: "Responsive Design",
    description: "Mobile-first approach ensuring your app looks great on all devices.",
    icon: "monitor",
  },
  {
    name: "Easy Integration",
    description: "Simple installation and setup with your existing React or Next.js projects.",
    icon: "download",
  },
];

export default function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-grey-900 sm:text-4xl">
            Everything you need to ship fast
          </h2>
          <p className="mt-4 text-lg text-grey-600">
            A complete toolkit for building modern web applications with confidence.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative p-6 rounded-2xl bg-grey-50 hover:bg-grey-100 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 mb-4">
                  <Icon name={feature.icon} size="md" />
                </div>
                <h3 className="text-lg font-semibold text-grey-900">{feature.name}</h3>
                <p className="mt-2 text-grey-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
