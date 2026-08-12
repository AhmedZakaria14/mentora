import Link from "next/link";
import { appConfig } from "@/lib/config";

export function Header() {
  return (
    <header className="header">
      <div className="shell nav">
        <Link href="/" className="brand" aria-label="Mentora الصفحة الرئيسية">
          <span className="brandMark">M</span>
          <span className="brandWord">{appConfig.name}</span>
        </Link>

        <nav className="navlinks" aria-label="التنقل الرئيسي">
          <Link href="/explore">استكشف الخبراء</Link>
          <Link href="/how-it-works">كيف تعمل؟</Link>
          <Link href="/pricing">الأسعار</Link>
          <Link href="/become-a-mentor">للخبراء</Link>
        </nav>

        <div className="navActions">
          <Link href="/login" className="ghost">تسجيل الدخول</Link>
          <Link href="/explore" className="btn small">اعثر على خبير</Link>
          <details className="mobileMenu">
            <summary className="menuButton" aria-label="فتح القائمة">
              <span></span><span></span><span></span>
            </summary>
            <div className="mobileMenuPanel">
              <Link href="/explore">استكشف الخبراء</Link>
              <Link href="/how-it-works">كيف تعمل؟</Link>
              <Link href="/pricing">الأسعار</Link>
              <Link href="/become-a-mentor">انضم كخبير</Link>
              <Link href="/login">تسجيل الدخول</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
