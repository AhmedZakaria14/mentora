const PRODUCTION_FALLBACK = "https://mentora-lovat-eight.vercel.app";

function normalizeUrl(value: string) {
  const normalized = value.startsWith("http") ? value : `https://${value}`;
  return normalized.replace(/\/$/, "");
}

function isLocalUrl(value?: string) {
  if (!value) return false;
  return /(^https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(value);
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelCurrent = process.env.VERCEL_URL;

  if (process.env.NODE_ENV === "production") {
    const productionCandidate = explicit && !isLocalUrl(explicit)
      ? explicit
      : vercelProduction || vercelCurrent || PRODUCTION_FALLBACK;
    return normalizeUrl(productionCandidate);
  }

  return normalizeUrl(explicit || vercelCurrent || "http://localhost:3000");
}

export const productionSiteUrl = PRODUCTION_FALLBACK;
