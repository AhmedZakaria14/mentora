import { DashboardShell } from "@/components/DashboardShell";
import { UiIcon } from "@/components/UiIcon";

export default function Admin() {
  return (
    <DashboardShell role="admin" title="راقب جودة السوق قبل أن تراقب الأرقام." subtitle="لوحة الإدارة ستعتمد على بيانات الإنتاج الفعلية مع RBAC؛ لا نعرض الآن GMV أو MRR أو طلبات خبراء وهمية.">
      <div className="dashboardNotice adminNotice"><UiIcon name="shield" size={19}/><div><b>Admin UI موجودة الآن كهيكل آمن فقط.</b><p>قبل تشغيل البيانات سنربط الصفحة بـRBAC وسياسات الخدمة حتى لا تصبح معلومات الإدارة متاحة للمستخدم العادي.</p></div></div>

      <div className="dashboardStatGrid">
        <div className="dashboardStat"><span><UiIcon name="users" size={18}/></span><small>طلبات خبراء للمراجعة</small><strong>—</strong><p>من mentor_applications</p></div>
        <div className="dashboardStat"><span><UiIcon name="calendar" size={18}/></span><small>حجوزات مؤكدة</small><strong>—</strong><p>من bookings بعد تفعيل RBAC</p></div>
        <div className="dashboardStat"><span><UiIcon name="briefcase" size={18}/></span><small>مدفوعات اليوم</small><strong>—</strong><p>بعد ربط مزود الدفع</p></div>
        <div className="dashboardStat"><span><UiIcon name="target" size={18}/></span><small>حالات تحتاج تدخل</small><strong>—</strong><p>نزاعات، Refunds أو Moderation</p></div>
      </div>

      <div className="dashboardTwoCol adminDashboardCols">
        <section className="dashboardPanel" id="applications">
          <div className="dashboardPanelHead"><div><span>الجودة</span><h2>طلبات الخبراء</h2></div></div>
          <div className="dashboardEmpty compactEmpty"><div className="emptyIcon"><UiIcon name="users" size={23}/></div><h3>لن نستخدم أسماء طلبات وهمية.</h3><p>بعد حماية هذا المسار للإدارة فقط، ستظهر هنا الطلبات الحقيقية مع حالة المراجعة وقرار القبول أو الرفض.</p></div>
        </section>

        <section className="dashboardPanel" id="moderation">
          <div className="dashboardPanelHead"><div><span>تشغيل السوق</span><h2>قائمة التحقق قبل الإطلاق</h2></div></div>
          <div className="setupChecklist adminChecklist">
            <div><span className="checkStep">1</span><div><b>RBAC وحماية المسارات</b><small>Admin/mentor/learner guards على الخادم.</small></div></div>
            <div><span className="checkStep">2</span><div><b>اعتماد الخبراء</b><small>تدفق مراجعة واضح مع Audit Log.</small></div></div>
            <div><span className="checkStep">3</span><div><b>الدفع والـwebhooks</b><small>Idempotency، Refunds وFinancial snapshots.</small></div></div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
