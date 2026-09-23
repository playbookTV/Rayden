import recipesData from "../../recipes/recipes.json";
import { referenceContext } from "../../manifests";
import { categoryError, success } from "../response";
import type { GetLayoutRecipesInput } from "../types";
export function handleGetLayoutRecipes(input: GetLayoutRecipesInput) {
  const categories = ["marketing", "dashboard", "forms", "content"];
  const error = categoryError(input?.category, categories);
  if (error) return error;
  const recipes = recipesData.recipes.filter(
    (r) => !input?.category || r.category === input.category
  );
  return success({
    ...referenceContext,
    totalRecipes: recipes.length,
    recipes,
    categories,
    note: "Authored layout examples. Confirm imports, state, dependencies, and current prop contracts; these are not certified end-to-end application implementations.",
  });
}
