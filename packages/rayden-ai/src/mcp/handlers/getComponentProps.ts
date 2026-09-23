import { getManifest } from "../../manifests";
import type { GetComponentPropsInput } from "../types";
import { success, failure } from "../response";
export function handleGetComponentProps(input: GetComponentPropsInput) {
  if (typeof input?.component !== "string" || !input.component.trim())
    return failure("component must be a non-empty string.");
  const manifest = getManifest(input.component);
  return manifest
    ? success(manifest)
    : failure(
        `Unknown or ambiguous component "${input.component}". Use get_components for supported exports.`
      );
}
