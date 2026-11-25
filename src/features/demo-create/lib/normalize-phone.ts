/** Accepts "+998 90 123 45 67", "901234567", … → "+998901234567"; null when invalid. */
export function normalizeUzPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("998") ? digits.slice(3) : digits;
  return /^\d{9}$/.test(local) ? `+998${local}` : null;
}
