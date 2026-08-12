import Link from "next/link";
import { MentorCard } from "@/components/MentorCard";
import { demoMentors } from "@/lib/demo-data";

export const metadata = { title: "استكشف الخبراء" };

const topicSignals: Array<{ terms: string[]; skills: string[]; label: string }> = [
  { terms: ["اعلان", "إعلان", "ads", "meta", "فيسبوك", "تحويل", "مبيعات", "متجر", "growth", "نمو"], skills: ["meta ads", "growth", "funnels"], label: "النمو والإعلانات" },
  { terms: ["seo", "جوجل", "google", "بحث", "محتوى", "ظهور", "ترتيب"], skills: ["seo", "content", "analytics"], label: "SEO والمحتوى" },
  { terms: ["product", "منتج", "startup", "شركة ناشئة", "إطلاق", "go-to-market", "gtm", "استراتيجية"], skills: ["product", "startups", "leadership"], label: "المنتج والشركات الناشئة" },
  { terms: ["قيادة", "وظيفة", "career", "مقابلة", "interview", "إدارة", "فريق"], skills: ["career", "leadership", "interviewing"], label: "القيادة والمسار المهني" },
];

function normalize(value: string) {
  return value.toLocaleLowerCase("ar").replace(/[ًٌٍَُِّْـ]/g, "").trim();
}

function scoreMentor(query: string, mentor: (typeof demoMentors)[number]) {
  if (!query) return 1;
  const q = normalize(query);
  const haystack = normalize([mentor.name, mentor.headline, mentor.country, ...mentor.languages, ...mentor.skills].join(" "));
  let score = haystack.includes(q) ? 6 : 0;

  for (const word of q.split(/\s+/).filter((word) => word.length > 2)) {
    if (haystack.includes(word)) score += 1;
  }

  for (const signal of topicSignals) {
    const signalMatched = signal.terms.some((term) => q.includes(normalize(term)));
    if (!signalMatched) continue;
    const mentorSkills = normalize(mentor.skills.join(" "));
    score += signal.skills.filter((skill) => mentorSkills.includes(skill)).length * 4;
  }
  return score;
}

function inferTopic(query: string) {
  const q = normalize(query);
  return topicSignals.find((signal) => signal.terms.some((term) => q.includes(normalize(term))))?.label;
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const ranked = demoMentors
    .map((mentor) => ({ mentor, score: scoreMentor(query, mentor) }))
    .sort((a, b) => b.score - a.score);
  const hasMeaningfulMatch = query && ranked.some((item) => item.score > 1);
  const visible = hasMeaningfulMatch ? ranked.filter((item) => item.score > 1) : ranked;
  const topic = query ? inferTopic(query) : undefined;

  return (
    <main className="explorePage">
      <section className="exploreHero">
        <div className="shell exploreHeroInner">
          <div>
            <span className="kicker">شبكة الخبراء</span>
            <h1>{query ? "وجدنا لك أقرب الخبرات لمشكلتك" : "ابحث عن الشخص المناسب لمشكلتك"}</h1>
            <p>{query ? <>بحثك: <b>“{query}”</b>{topic ? <> • أقرب مجال: <strong>{topic}</strong></> : null}</> : "ابحث بالمهارة أو اكتب المشكلة بطريقتك، ثم قارن بين الخبرة والسعر واللغة والموعد."}</p>
          </div>
          <form className="exploreSearch" action="/explore">
            <span>⌕</span>
            <input name="q" defaultValue={query} aria-label="ابحث عن خبير" placeholder="مثال: إعلاناتي لا تحقق مبيعات، SEO، إدارة منتج..." />
            <button className="btn" type="submit">بحث</button>
          </form>
        </div>
      </section>

      <section className="shell exploreContent">
        <div className="exploreToolbar">
          <div className="filterChips"><span className="active">الأفضل تطابقًا</span><span>المهارة</span><span>اللغة</span><span>السعر</span><span>أقرب موعد</span></div>
          <small>{visible.length} نتائج تجريبية</small>
        </div>

        {query ? (
          <div className="matchExplanation">
            <span>✦</span>
            <div><b>كيف رتبنا النتائج؟</b><p>نطابق كلمات مشكلتك مع تخصصات الخبراء والمهارات المتاحة حاليًا. المرحلة التالية ستستبدل هذا الترتيب ببيانات الخبراء الحقيقية ومحرك المطابقة الدلالية.</p></div>
          </div>
        ) : null}

        <div className="mentorGrid exploreMentorGrid">
          {visible.map(({ mentor, score }) => (
            <div className="rankedMentor" key={mentor.id}>
              {query && score > 1 ? <span className="matchScore">{Math.min(98, 72 + score * 2)}% تطابق</span> : null}
              <MentorCard mentor={mentor} />
            </div>
          ))}
        </div>

        <div className="exploreRealityNote">
          <div><b>الخبراء المعروضون الآن نماذج للواجهة.</b><p>لن ننشر أي خبير للعامة قبل اكتمال طلبه واعتماده من لوحة الإدارة.</p></div>
          <Link href="/become-a-mentor" className="textCta darkTextCta">تقدّم كخبير ←</Link>
        </div>
      </section>
    </main>
  );
}
