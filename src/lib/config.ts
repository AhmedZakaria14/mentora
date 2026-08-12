export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Mentora",
  taglineAr: "خبرة سنوات، في جلسة واحدة.",
  taglineEn: "Years of experience, in one conversation.",
  defaultLocale: "ar",
  defaultCurrency: "EGP",
  marketplaceCommissionBps: 2000,
  bookingHoldMinutes: 10,
} as const;
