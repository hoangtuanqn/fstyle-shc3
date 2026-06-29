const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SPECIAL = '@#$!%^&*';
const ALL = UPPER + LOWER + DIGITS + SPECIAL;

export function generateStrongPassword(): string {
  const rand = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

  const required = [rand(UPPER), rand(LOWER), rand(DIGITS), rand(SPECIAL)];
  const extra = Array.from({ length: 8 }, () => rand(ALL));
  const combined = [...required, ...extra];

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}
