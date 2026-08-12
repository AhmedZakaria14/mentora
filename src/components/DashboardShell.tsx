import Link from "next/link";
import { UiIcon } from "@/components/UiIcon";

export type DashboardRole = "learner" | "mentor" | "admin";

type NavItem = { label: string; href: string; icon: "chart" | "calendar" | "message" | "users" | "briefcase" | "target" };

const navByRole: Record<DashboardRole, NavItem[]> = {
  learner: [
    { label: "نظرة عامة", href: "/dashboard", icon: "chart" },
    { label: "جلساتي", href: "/dashboard#sessions", icon: "calendar" },
    { label: "الرسائل", href: "/dashboard#messages", icon: "message" },
    { label: "الخبراء المحفوظون", href: "/dashboard#saved", icon: "users" },
    { label: "التكاملات", href: "/settings/integrations", icon: "target" },
  ],
  mentor: [
    { label: "نظرة عامة", href: "/mentor/dashboard", icon: "chart" },
    { label: "الجلسات", href: "/mentor/dashboard#sessions", icon: "calendar" },
    { label: "الخدمات والأسعار", href: "/mentor/dashboard#services", icon: "briefcase" },
    { label: "التوافر", href: "/mentor/dashboard#availability", icon: "target" },
    { label: "الرسائل", href: "/mentor/dashboard#messages", icon: "message" },
  ],
  admin: [
    { label: "نظرة عامة", href: "/admin", icon: "chart" },
    { label: "طلبات الخبراء", href: "/admin#applications", icon: "users" },
    { label: "الحجوزات", href: "/admin#bookings", icon: "calendar" },
    { label: "المدفوعات", href: "/admin#payments", icon: "briefcase" },
    { label: "المراجعة والإشراف", href: "/admin#moderation", icon: "target" },
  ],
};

const roleLabel: Record<DashboardRole, string> = {
  learner: "مساحة المتعلم",
  mentor: "مساحة الخبير",
  admin: "إدارة Mentora",
};

export function DashboardShell({ role, title, subtitle, children }: { role: DashboardRole; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="productDashboard">
      <div className="shell dashboardShellGrid">
        <aside className="productSidebar">
          <div className="sidebarRole"><span className="sidebarMiniLogo">M</span><div><b>{roleLabel[role]}</b><small>نسخة تشغيلية أولية</small></div></div>
          <nav aria-label={roleLabel[role]}>
            {navByRole[role].map((item, index) => <Link className={index === 0 ? "active" : ""} href={item.href} key={item.label}><UiIcon name={item.icon} size={18}/><span>{item.label}</span></Link>)}
          </nav>
          <div className="sidebarHelp"><UiIcon name="message" size={18}/><div><b>تحتاج مساعدة؟</b><small>ستظهر هنا قنوات الدعم عند تشغيلها.</small></div></div>
        </aside>

        <section className="dashboardWorkspace">
          <header className="dashboardTopbar">
            <div><span className="dashboardEyebrow">{roleLabel[role]}</span><h1>{title}</h1><p>{subtitle}</p></div>
            <Link href="/explore" className="dashboardTopAction">استكشف الخبراء <UiIcon name="arrow" size={16}/></Link>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
