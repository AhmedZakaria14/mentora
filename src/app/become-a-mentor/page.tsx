import { MentorApplicationForm } from "./MentorApplicationForm";

export const metadata = { title: "انضم كخبير" };

export default function Page() {
  return <main className="shell">
    <div className="pageHero">
      <div className="eyebrow">للخبراء والمعلمين والملهمين</div>
      <h1>حوّل خبرتك إلى جلسات ذات قيمة</h1>
      <p className="muted">حدد ما تتقنه، ثم نراجع ملفك يدويًا قبل أن يصبح متاحًا للحجز على Mentora.</p>
    </div>
    <MentorApplicationForm />
  </main>;
}
