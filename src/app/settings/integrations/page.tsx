import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "التكاملات" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ google?: string }>;

const messages: Record<string, string> = {
  connected: "تم ربط حساب Google بنجاح.",
  disconnected: "تم فصل حساب Google.",
  denied: "تم إلغاء طلب صلاحيات Google.",
  missing_provider_token: "تم تسجيل الدخول، لكن Google لم يمنح رمز Workspace المطلوب. أعد الربط ووافق على الصلاحيات.",
  error: "تعذر إكمال ربط Google. تحقق من الصلاحيات ثم حاول مرة أخرى.",
};

export default async function IntegrationsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/integrations");

  const { data: rows } = await supabase.rpc("get_google_connection_summary");
  const connection = Array.isArray(rows) ? rows[0] : null;
  const enabled = new Set<string>(connection?.enabled_features ?? []);
  const statusMessage = params.google ? messages[params.google] : null;

  return <main className="shell">
    <div className="pageHero">
      <div className="eyebrow">الإعدادات</div>
      <h1>تكاملات Google Workspace</h1>
      <p className="muted">اربط حسابك للجدولة، إنشاء Google Meet تلقائيًا، والتواصل عبر Google Chat عند الحاجة.</p>
    </div>

    {statusMessage && <div className="panel" style={{maxWidth:860,marginBottom:16,padding:16}}>{statusMessage}</div>}

    <div className="panel" style={{maxWidth:860,marginBottom:24}}>
      <div className="listItem">
        <div>
          <b>حالة الاتصال</b>
          <div className="muted">{connection ? `متصل${connection.google_email ? ` — ${connection.google_email}` : ""}` : "غير متصل"}</div>
        </div>
        {connection
          ? <Link className="btn small" href="/api/integrations/google/disconnect?returnTo=/settings/integrations">فصل Google</Link>
          : <Link className="btn small" href="/api/integrations/google/connect?features=calendar,meet,chat&returnTo=/settings/integrations">ربط Google</Link>}
      </div>
    </div>

    <div className="categoryGrid" style={{marginBottom:24,maxWidth:860}}>
      <IntegrationCard title="Google Calendar" active={enabled.has("calendar")} description="فحص أوقات الانشغال وإنشاء وتحديث مواعيد الجلسات بدون كشف تفاصيل تقويمك الخاص." feature="calendar" />
      <IntegrationCard title="Google Meet" active={enabled.has("meet")} description="إنشاء رابط Meet للجلسات والوصول إلى بيانات الجلسة المصرح بها عند توافرها." feature="meet" />
      <IntegrationCard title="Google Chat" active={enabled.has("chat")} description="إضافة قناة تواصل اختيارية للعلاقات الإرشادية المستمرة، مع بقاء رسائل Mentora هي البديل الأساسي." feature="chat" />
    </div>

    <div className="panel" style={{maxWidth:860,marginBottom:80}}>
      <b>الخصوصية والصلاحيات</b>
      <p className="muted" style={{fontSize:13,marginBottom:0}}>تسجيل الدخول الأساسي لا يمنح صلاحيات Calendar أو Meet أو Chat. يتم طلبها فقط عند تفعيل Workspace، ويمكنك فصل الربط في أي وقت.</p>
    </div>
  </main>;
}

function IntegrationCard({ title, active, description, feature }: { title: string; active: boolean; description: string; feature: "calendar" | "meet" | "chat" }) {
  return <div className="category" style={{display:"flex",flexDirection:"column",gap:10}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}>
      <strong>{title}</strong>
      <span style={{fontSize:12,fontWeight:800}}>{active ? "متصل ✓" : "غير مفعل"}</span>
    </div>
    <p className="muted" style={{fontSize:13,margin:0}}>{description}</p>
    {!active && <Link style={{marginTop:"auto",fontWeight:800,fontSize:13,color:"#177b54"}} href={`/api/integrations/google/connect?features=${feature}&returnTo=/settings/integrations`}>تفعيل {title}</Link>}
  </div>;
}
