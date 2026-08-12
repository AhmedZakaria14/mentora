import Link from "next/link";

export const metadata = { title: "التكاملات" };

export default function IntegrationsPage({ searchParams }: { searchParams: Promise<{ google?: string }> }) {
  return <main className="shell">
    <div className="pageHero"><div className="eyebrow">الإعدادات</div><h1>التكاملات</h1><p className="muted">اربط Google Workspace للجدولة، إنشاء Meet، والتواصل عبر Chat.</p></div>
    <div className="panel" style={{maxWidth:760,marginBottom:80}}>
      <div className="listItem"><div><b>Google Calendar + Meet + Chat</b><div className="muted">فحص المواعيد المشغولة، إنشاء الموعد وMeet، وGoogle Chat بشكل اختياري.</div></div><Link className="btn small" href="/api/integrations/google/connect?features=calendar,meet,chat&returnTo=/settings/integrations">ربط Google</Link></div>
      <p className="muted" style={{fontSize:13}}>يتم طلب الصلاحيات من Google بصورة منفصلة عن تسجيل الدخول العادي، ويمكن فصل الربط لاحقًا.</p>
    </div>
  </main>;
}
