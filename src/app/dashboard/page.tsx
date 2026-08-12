import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { UiIcon } from "@/components/UiIcon";

export default function Dashboard() {
  return (
    <DashboardShell role="learner" title="كل ما تحتاجه حول جلساتك في مكان واحد." subtitle="الحجوزات والملخصات والتكاملات ستظهر هنا بمجرد بدء استخدام الحساب فعليًا.">
      <div className="dashboardNotice"><UiIcon name="shield" size={19}/><div><b>لوحة المنتج قيد التفعيل.</b><p>لن نعرض أرقامًا أو جلسات تجريبية على أنها بيانات حساب حقيقية. العناصر أدناه توضح تدفق المنتج فقط.</p></div></div>

      <div className="dashboardStatGrid">
        <div className="dashboardStat"><span><UiIcon name="calendar" size={18}/></span><small>الجلسات القادمة</small><strong>—</strong><p>تظهر بعد أول حجز مؤكد</p></div>
        <div className="dashboardStat"><span><UiIcon name="message" size={18}/></span><small>ملخصات الجلسات</small><strong>—</strong><p>بعد انتهاء الجلسة ومعالجة الملخص</p></div>
        <div className="dashboardStat"><span><UiIcon name="users" size={18}/></span><small>الخبراء المحفوظون</small><strong>—</strong><p>احفظ الملفات التي تريد الرجوع إليها</p></div>
        <div className="dashboardStat"><span><UiIcon name="target" size={18}/></span><small>تكامل Google</small><strong>اختياري</strong><p>Calendar وMeet عند الحاجة</p></div>
      </div>

      <section className="dashboardPanel" id="sessions">
        <div className="dashboardPanelHead"><div><span>جلساتك</span><h2>الجلسة القادمة</h2></div><Link href="/explore" className="textLink">احجز أول جلسة <UiIcon name="arrow" size={15}/></Link></div>
        <div className="dashboardEmpty"><div className="emptyIcon"><UiIcon name="calendar" size={25}/></div><h3>لا توجد جلسة مؤكدة حتى الآن.</h3><p>استكشف الخبراء، اختر ملفًا مناسبًا، ثم حدد الوقت الذي يناسبك. ستظهر تفاصيل Google Meet هنا بعد اكتمال الحجز.</p><Link href="/explore" className="btn">استكشف الخبراء <UiIcon name="arrow" size={17}/></Link></div>
      </section>
    </DashboardShell>
  );
}
