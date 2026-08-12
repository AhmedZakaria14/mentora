import Link from "next/link";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { UiIcon } from "@/components/UiIcon";

const errorMessages: Record<string, string> = {
  google_signin: "تعذر بدء تسجيل الدخول عبر Google.",
  missing_code: "لم يصل رمز المصادقة من Google.",
  oauth_callback: "تعذر إنشاء جلسة تسجيل الدخول. حاول مرة أخرى.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  return (
    <main className="loginPage proLoginPage">
      <div className="loginGlow loginGlowOne" />
      <div className="loginGlow loginGlowTwo" />
      <div className="shell loginShell proLoginShell">
        <section className="loginStory proLoginStory">
          <span className="eyebrowPill"><UiIcon name="spark" size={16}/> حساب واحد لكل رحلتك في Mentora</span>
          <h1>احجز، التقِ بالخبير، وارجع إلى كل ما اتفقتما عليه.</h1>
          <p>تسجيل الدخول الأساسي يستخدم حساب Google فقط لإنشاء حساب Mentora. صلاحيات Calendar وMeet لا تُطلب إلا لاحقًا عندما تختار ربطها.</p>
          <div className="loginProofs proLoginProofs">
            <span><UiIcon name="shield" size={17}/> حساب Mentora مستقل عن صلاحيات Workspace</span>
            <span><UiIcon name="calendar" size={17}/> حجوزاتك ومواعيدك في مكان واحد</span>
            <span><UiIcon name="message" size={17}/> الملخصات والرسائل مرتبطة بجلساتك</span>
          </div>
        </section>

        <section className="loginCard proLoginCard">
          <div className="loginCardBrand"><span className="brandMark">M</span><span>Mentora</span></div>
          <span className="loginCardKicker">تسجيل الدخول</span>
          <h2>مرحبًا بك من جديد</h2>
          <p className="loginCardLead">استخدم حساب Google للمتابعة إلى حسابك.</p>
          {error ? <div className="loginError"><UiIcon name="shield" size={18}/><span>{errorMessages[error] || "تعذر تسجيل الدخول. حاول مرة أخرى."}</span></div> : null}
          <GoogleSignInButton next={safeNext} />
          <div className="loginDivider"><span>لا تريد تسجيل الدخول الآن؟</span></div>
          <Link className="browseWithoutLogin" href="/explore">تصفح الخبراء أولًا <UiIcon name="arrow" size={16}/></Link>
          <div className="loginPrivacy"><UiIcon name="shield" size={14}/><p>لن نطلب Calendar أو Meet في هذه الخطوة. ربطهما اختياري ومنفصل داخل إعدادات الحساب.</p></div>
        </section>
      </div>
    </main>
  );
}
