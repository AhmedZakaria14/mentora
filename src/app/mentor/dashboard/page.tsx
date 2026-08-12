import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { UiIcon } from "@/components/UiIcon";

export default function MentorDashboard() {
  return (
    <DashboardShell role="mentor" title="أدر خبرتك، خدماتك ومواعيدك بوضوح." subtitle="هذه الواجهة ستتصل بملف الخبير الحقيقي بعد اعتماد الطلب وتفعيل الدور على الحساب.">
      <div className="dashboardNotice mentorNotice"><UiIcon name="shield" size={19}/><div><b>بيانات الخبير الحقيقية لم تُربط بهذه الشاشة بعد.</b><p>نستخدم Empty States بدل أرقام إيرادات أو تقييمات وهمية إلى أن تصبح الجلسات والمدفوعات فعلية.</p></div></div>

      <div className="dashboardStatGrid">
        <div className="dashboardStat"><span><UiIcon name="calendar" size={18}/></span><small>جلسات هذا الشهر</small><strong>—</strong><p>حجوزات مؤكدة فقط</p></div>
        <div className="dashboardStat"><span><UiIcon name="briefcase" size={18}/></span><small>صافي الأرباح</small><strong>—</strong><p>من دفتر الأرباح الفعلي</p></div>
        <div className="dashboardStat"><span><UiIcon name="target" size={18}/></span><small>الخدمات النشطة</small><strong>—</strong><p>بعد إنشاء أول خدمة</p></div>
        <div className="dashboardStat"><span><UiIcon name="clock" size={18}/></span><small>أقرب حجز</small><strong>—</strong><p>حسب توافرك والتقويم</p></div>
      </div>

      <div className="dashboardTwoCol">
        <section className="dashboardPanel" id="sessions">
          <div className="dashboardPanelHead"><div><span>الجدول</span><h2>الجلسات القادمة</h2></div></div>
          <div className="dashboardEmpty compactEmpty"><div className="emptyIcon"><UiIcon name="calendar" size={23}/></div><h3>لا توجد حجوزات فعلية بعد.</h3><p>بعد اعتماد ملفك وإنشاء الخدمات والتوافر، ستظهر الجلسات المؤكدة هنا مع روابط Meet.</p></div>
        </section>

        <section className="dashboardPanel" id="services">
          <div className="dashboardPanelHead"><div><span>الإعداد</span><h2>جهّز ملفك للبيع</h2></div></div>
          <div className="setupChecklist">
            <div><span className="checkStep">1</span><div><b>أكمل الملف المهني</b><small>نبذة، تخصصات، خبرة ولغات.</small></div></div>
            <div><span className="checkStep">2</span><div><b>أنشئ خدمة وسعرًا</b><small>مدة الجلسة وما الذي سيحصل عليه العميل.</small></div></div>
            <div><span className="checkStep">3</span><div><b>حدد التوافر</b><small>مواعيد متكررة واستثناءات وتقويم Google.</small></div></div>
          </div>
          <Link href="/settings/integrations" className="dashboardInlineAction">إدارة تكامل Google <UiIcon name="arrow" size={15}/></Link>
        </section>
      </div>
    </DashboardShell>
  );
}
