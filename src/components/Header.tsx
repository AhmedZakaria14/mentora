import Link from "next/link";
import { appConfig } from "@/lib/config";

export function Header() {
  return <header className="header"><div className="shell nav">
    <Link href="/" className="brand">{appConfig.name}<span>.</span></Link>
    <nav className="navlinks">
      <Link href="/explore">استكشف الخبراء</Link>
      <Link href="/how-it-works">كيف تعمل؟</Link>
      <Link href="/pricing">الأسعار</Link>
      <Link href="/become-a-mentor">انضم كخبير</Link>
    </nav>
    <div className="navActions"><button className="ghost">EN</button><Link href="/dashboard" className="btn small">ابدأ الآن</Link></div>
  </div></header>
}
