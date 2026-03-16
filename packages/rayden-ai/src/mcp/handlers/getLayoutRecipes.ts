/**
 * Handler for get_layout_recipes tool
 */

import type { GetLayoutRecipesInput, RecipeSummary } from "../types.js";

// Import recipes - this will be populated when we create recipes
let recipesData: { recipes: Array<RecipeSummary & { code: string }> } | null = null;

try {
  // Dynamic import for recipes
  recipesData = require("../../recipes/recipes.json");
} catch {
  recipesData = null;
}

export function handleGetLayoutRecipes(input: GetLayoutRecipesInput) {
  const { category } = input;

  if (!recipesData) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              error: "Recipes data not found",
              note: "Layout recipes are being developed",
            },
            null,
            2
          ),
        },
      ],
    };
  }

  let recipes = recipesData.recipes;

  if (category) {
    recipes = recipes.filter((r) => r.category === category);
  }

  const response = {
    totalRecipes: recipes.length,
    recipes: recipes.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
      tags: r.tags,
      components: r.components,
      code: r.code,
    })),
    categories: ["marketing", "dashboard", "forms", "content"],
    note: "Each recipe includes complete, working code using Rayden UI components",
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(response, null, 2),
      },
    ],
  };
}
