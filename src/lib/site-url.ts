const PRODUCTION_FALLBACK = "https://mentora-lovat-eight.vercel.app";

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelCurrent = process.env.VERCEL_URL;
  const raw = explicit || vercelProduction || vercelCurrent || PRODUCTION_FALLBACK;
  const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
  return normalized.replace(/\/$/, "");
}

export const productionSiteUrl = PRODUCTION_FALLBACK;
