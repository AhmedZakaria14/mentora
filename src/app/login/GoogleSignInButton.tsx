export function GoogleSignInButton({ next = "/dashboard" }: { next?: string }) {
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  return (
    <div className="googleSignInWrap">
      <a className="googleOAuthButton" href={`/auth/google?next=${encodeURIComponent(safeNext)}`}>
        <span className="googleMark" aria-hidden="true">G</span>
        <span>المتابعة باستخدام Google</span>
        <b aria-hidden="true">←</b>
      </a>
      <p className="loginStatus">سيتم إرجاعك تلقائيًا إلى Mentora بعد اختيار حساب Google.</p>
    </div>
  );
}
