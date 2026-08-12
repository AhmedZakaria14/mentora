import type { Metadata } from "next";
import "./globals.css";
import "./home.css";
import "./explore.css";
import "./profile.css";
import "./dashboard.css";
import "./auth.css";
import { Header } from "@/components/Header";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: { default: `${appConfig.name} | خبراء ومرشدون 1:1`, template: `%s | ${appConfig.name}` },
  description: "تحدث مباشرة مع خبير سبق أن واجه التحدي الذي تواجهه. جلسات شخصية 1:1 في التسويق، الأعمال، المنتج، التقنية، القيادة والمزيد.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body><Header />{children}</body></html>;
}
