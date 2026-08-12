import Link from "next/link";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 620 }}>
        <div className="panel" style={{ textAlign: "center" }}>
          <div className="eyebrow">Mentora</div>
          <h1>سجّل دخولك وابدأ جلستك التالية</h1>
          <p className="muted">استخدم حساب Google لتسجيل الدخول. ربط Calendar وMeet وChat سيتم لاحقًا بصورة منفصلة وبصلاحيات واضحة.</p>
          {error ? <p className="notice error">تعذر تسجيل الدخول. حاول مرة أخرى.</p> : null}
          <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
            <Link className="btn" href="/auth/google">المتابعة باستخدام Google</Link>
            <Link className="ghost" href="/explore">تصفح الخبراء أولًا</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
