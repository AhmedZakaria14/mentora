import Link from "next/link";
import { GoogleSignInButton } from "./GoogleSignInButton";

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
    <main className="loginPage">
      <div className="loginGlow loginGlowOne" />
      <div className="loginGlow loginGlowTwo" />
      <div className="shell loginShell">
        <section className="loginStory">
          <span className="pillLabel">Mentora • خبرة حقيقية عند الطلب</span>
          <h1>لا تضيع أسبوعًا في مشكلة يمكن أن يحلها حوار واحد.</h1>
          <p>سجّل الدخول ثم أخبرنا أين توقفت. نساعدك في الوصول إلى خبير مناسب، حجز موعد، وإكمال الجلسة عبر Google Meet من مكان واحد.</p>
          <div className="loginProofs">
            <span>✓ خبراء يتم التحقق منهم</span>
            <span>✓ جلسات مباشرة 1:1</span>
            <span>✓ مطابقة حسب مشكلتك</span>
          </div>
        </section>

        <section className="loginCard">
          <Link href="/" className="loginBrand">Mentora<span>.</span></Link>
          <h2>مرحبًا بك</h2>
          <p className="muted">استخدم حساب Google للمتابعة. تسجيل الدخول الأساسي لا يطلب صلاحيات Calendar أو Meet.</p>
          {error ? <p className="notice error">{errorMessages[error] || "تعذر تسجيل الدخول. حاول مرة أخرى."}</p> : null}
          <GoogleSignInButton next={safeNext} />
          <div className="loginDivider"><span>أو</span></div>
          <Link className="btn secondaryBtn fullBtn" href="/explore">تصفح الخبراء بدون تسجيل</Link>
          <p className="loginFinePrint">بالمتابعة أنت توافق على شروط الاستخدام وسياسة الخصوصية عند إضافتهما للنسخة النهائية.</p>
        </section>
      </div>
    </main>
  );
}
