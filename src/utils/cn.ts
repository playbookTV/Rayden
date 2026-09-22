import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Rayden's named type scale belongs to font size, not text color. Without this
// extension, merging a foreground with text-body-sm silently drops one of them.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display-lg",
        "display-sm",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "body-xs",
        "body-sm",
        "body-md",
        "body-lg",
        "caption-sm",
        "caption-xs",
        "caption-lg",
        "label-lg",
        "label-md",
        "label-sm",
        "code-md",
        "code-sm",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
