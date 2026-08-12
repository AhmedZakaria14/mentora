import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: { default: `${appConfig.name} | خبراء 1:1`, template: `%s | ${appConfig.name}` },
  description: "احجز جلسة شخصية 1:1 مع خبراء موثوقين في التسويق، الأعمال، البرمجة، الإدارة والمزيد.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body><Header />{children}</body></html>;
}
