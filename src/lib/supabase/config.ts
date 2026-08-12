export const supabasePublicConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hbhjyicipitslcerlhfi.supabase.co",
  publishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_ZnLuUPHwd2RSAqMhHM5pTA_LrXJDEUK",
} as const;
