/**
 * Permissive format check for a trimmed address; the consuming application
 * remains the authority on deliverability. Each scan is linear in input length.
 */
export function isValidEmail(email: string): boolean {
  if (/\s/.test(email)) return false;

  const at = email.indexOf("@");
  if (at < 1 || email.indexOf("@", at + 1) !== -1) return false;

  // Require a dot with at least one domain character on either side, keeping
  // the previous permissive handling of additional dots without backtracking.
  const dot = email.indexOf(".", at + 2);
  return dot !== -1 && dot < email.length - 1;
}
