import { referenceContext } from "../manifests";
export function success(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}
export function failure(message: string) {
  return { ...success({ error: message, ...referenceContext }), isError: true };
}
export function categoryError(category: unknown, choices: readonly string[]) {
  return category !== undefined && (typeof category !== "string" || !choices.includes(category))
    ? failure(`category must be one of: ${choices.join(", ")}`)
    : null;
}
