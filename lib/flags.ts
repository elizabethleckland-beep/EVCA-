
/**
 * Simple feature flag utility.
 * Reads from NEXT_PUBLIC_FLAGS (comma-separated string).
 */
export function isEnabled(name: string): boolean {
  const flags = (process.env.NEXT_PUBLIC_FLAGS || '')
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);
  return flags.includes(name);
}
