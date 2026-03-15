/**
 * Layout Recipes
 *
 * Pre-built layout patterns using Rayden UI components.
 */

import recipesData from './recipes.json';
import schemaDefinition from './schema.json';

// Export schema
export const recipeSchema = schemaDefinition;

// Export all recipes
export const recipes = recipesData.recipes;

// Types
export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'marketing' | 'dashboard' | 'forms' | 'content';
  tags: string[];
  components: string[];
  code: string;
  customizationPoints?: Array<{
    id: string;
    type: string;
    default?: unknown;
    description: string;
  }>;
}

// Get all recipes
export function getAllRecipes(): Recipe[] {
  return recipes as Recipe[];
}

// Get recipe by ID
export function getRecipe(id: string): Recipe | null {
  return (recipes as Recipe[]).find((r) => r.id === id) ?? null;
}

// Get recipes by category
export function getRecipesByCategory(category: string): Recipe[] {
  return (recipes as Recipe[]).filter((r) => r.category === category);
}

// Get recipes by tag
export function getRecipesByTag(tag: string): Recipe[] {
  return (recipes as Recipe[]).filter((r) => r.tags.includes(tag));
}

// Get recipes that use a specific component
export function getRecipesByComponent(componentName: string): Recipe[] {
  return (recipes as Recipe[]).filter((r) => r.components.includes(componentName));
}

// Get all unique tags
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const recipe of recipes) {
    for (const tag of recipe.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

// Get recipe categories
export function getCategories(): string[] {
  return ['marketing', 'dashboard', 'forms', 'content'];
}

// Search recipes by query
export function searchRecipes(query: string): Recipe[] {
  const lowerQuery = query.toLowerCase();
  return (recipes as Recipe[]).filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}
