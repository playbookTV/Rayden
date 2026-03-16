/**
 * Handler for get_tokens tool
 */

import {
  tokens,
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  breakpoints,
} from "../../tokens/index.js";
import type { GetTokensInput } from "../types.js";

export function handleGetTokens(input: GetTokensInput) {
  const { category } = input;

  let response: unknown;

  if (category) {
    // Return specific category
    switch (category) {
      case "colors":
        response = {
          category: "colors",
          data: colors,
          usage:
            "Use with Tailwind: bg-{color}-{shade}, text-{color}-{shade}, border-{color}-{shade}",
          examples: [
            "bg-primary-500 (primary button)",
            "text-grey-700 (body text)",
            "border-grey-200 (card border)",
            "bg-success-500 (success state)",
            "text-error-500 (error message)",
          ],
        };
        break;
      case "spacing":
        response = {
          category: "spacing",
          data: spacing,
          usage:
            "Use with Tailwind: p-{size}, m-{size}, gap-{size}, space-x-{size}, space-y-{size}",
          examples: ["p-4 (16px padding)", "gap-6 (24px gap)", "mt-8 (32px margin-top)"],
        };
        break;
      case "typography":
        response = {
          category: "typography",
          data: typography,
          usage: "Use with Tailwind: text-{preset}",
          examples: [
            "text-h1 (heading 1)",
            "text-body-md (body text)",
            "text-caption-sm (small caption)",
          ],
        };
        break;
      case "shadows":
        response = {
          category: "shadows",
          data: shadows,
          usage: "Use with Tailwind: shadow-{type}-{size}",
          examples: [
            "shadow-soft-sm (card shadow)",
            "shadow-soft-md (modal shadow)",
            "shadow-hard-xxs (button shadow)",
          ],
        };
        break;
      case "borderRadius":
        response = {
          category: "borderRadius",
          data: borderRadius,
          usage: "Use with Tailwind: rounded-{size}",
          examples: ["rounded-md (6px)", "rounded-lg (8px)", "rounded-full (pill shape)"],
        };
        break;
      case "breakpoints":
        response = {
          category: "breakpoints",
          data: breakpoints,
          usage: "Use with Tailwind: {breakpoint}:class",
          examples: [
            "sm:flex (flex on small screens)",
            "md:grid-cols-2 (2 columns on medium)",
            "lg:px-8 (larger padding on large)",
          ],
        };
        break;
    }
  } else {
    // Return all tokens
    response = {
      version: tokens.version,
      name: tokens.name,
      categories: ["colors", "spacing", "typography", "shadows", "borderRadius", "breakpoints"],
      colors: {
        scales: Object.keys(colors),
        note: 'Use get_tokens with category="colors" for full color data',
      },
      spacing: {
        sizes: Object.keys(spacing),
        note: 'Use get_tokens with category="spacing" for full spacing data',
      },
      typography: {
        presets: Object.keys(typography),
        note: 'Use get_tokens with category="typography" for full typography data',
      },
      shadows: {
        types: Object.keys(shadows),
        note: 'Use get_tokens with category="shadows" for full shadow data',
      },
      borderRadius,
      breakpoints,
      usage: "All tokens are available as Tailwind utility classes",
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(response, null, 2),
      },
    ],
  };
}
