import { components, referenceContext } from "../../manifests";
import type { GetComponentsInput } from "../types";
import { categoryError, success } from "../response";
export function handleGetComponents(input: GetComponentsInput) {
  const error = categoryError(input?.category, Object.keys(components.categories));
  if (error) return error;
  const list = components.components.filter(
    (c) => !input?.category || c.category === input.category
  );
  return success({
    ...referenceContext,
    totalComponents: list.length,
    components: list,
    categories: components.categories,
    note: "Entries describe component families; use exportNames and importPath for real imports. Look up each export for its own props.",
  });
}
