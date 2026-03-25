import { Button, Badge } from "@raydenui/ui";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Badge color="orange" className="mb-6">
          New Release
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-grey-900 sm:text-6xl">
          Build beautiful products faster
        </h1>
        <p className="mt-6 text-lg leading-8 text-grey-600 max-w-2xl mx-auto">
          A modern component library that helps you create stunning user interfaces
          with pre-built components, design tokens, and best practices built-in.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="secondary" appearance="outlined">
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  );
}
