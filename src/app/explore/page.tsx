import Link from "next/link";
import { MentorCard } from "@/components/MentorCard";
import { UiIcon } from "@/components/UiIcon";
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
  const hasMeaningfulMatch = Boolean(query) && ranked.some((item) => item.score > 1);
  const visible = hasMeaningfulMatch ? ranked.filter((item) => item.score > 1) : ranked;
  const topic = query ? inferTopic(query) : undefined;

  return (
    <main className="explorePage proExplorePage">
      <section className="exploreHero proExploreHero">
        <div className="shell exploreHeroInner proExploreHeroInner">
          <div className="exploreIntro">
            <span className="sectionKicker">شبكة الخبراء</span>
            <h1>{query ? "خبرات أقرب إلى التحدي الذي وصفته" : "ابدأ بالمشكلة، ثم اختر الخبرة المناسبة."}</h1>
            <p>
              {query ? <><span>بحثك</span><b>“{query}”</b>{topic ? <em>أقرب مجال: {topic}</em> : null}</> : "اكتب المشكلة بلغتك، أو ابحث بالمهارة. بعدها قارن الخبرة والسعر واللغة والموعد قبل الحجز."}
            </p>
          </div>

          <form className="exploreSearch proExploreSearch" action="/explore">
            <UiIcon name="search" size={20}/>
            <input name="q" defaultValue={query} aria-label="ابحث عن خبير" placeholder="مثال: إعلاناتي لا تحقق مبيعات، SEO، إطلاق منتج..." />
            <button className="btn" type="submit">بحث <UiIcon name="arrow" size={16}/></button>
          </form>
        </div>
      </section>

      <section className="shell exploreContent proExploreContent">
        <div className="exploreControlRow">
          <div className="resultSummary">
            <b>{visible.length}</b>
            <span>{query ? "نتائج قريبة من بحثك" : "خبراء في النسخة التجريبية"}</span>
          </div>
          <div className="filterChips proFilterChips" aria-label="فلاتر الاستكشاف">
            <button className="active" type="button">الأفضل تطابقًا</button>
            <button type="button">المهارة</button>
            <button type="button">اللغة</button>
            <button type="button">السعر</button>
            <button type="button">أقرب موعد</button>
          </div>
        </div>

        {query ? (
          <div className="matchExplanation proMatchExplanation">
            <div className="matchExplanationIcon"><UiIcon name="spark" size={19}/></div>
            <div><b>كيف رتبنا هذه النتائج؟</b><p>الترتيب الحالي تجريبي ويعتمد على كلمات المشكلة والمهارات الموجودة في ملفات العرض. قبل الإطلاق سنربطه ببيانات الخبراء الحقيقية ومحرك مطابقة دلالي.</p></div>
          </div>
        ) : null}

        <div className="mentorGrid exploreMentorGrid proResultGrid">
          {visible.map(({ mentor, score }) => (
            <div className="rankedMentor proRankedMentor" key={mentor.id}>
              {query && score > 1 ? <span className="matchScore proMatchScore"><UiIcon name="target" size={13}/>{Math.min(98, 72 + score * 2)}% تطابق مبدئي</span> : null}
              <MentorCard mentor={mentor} />
            </div>
          ))}
        </div>

        <div className="exploreRealityNote proRealityNote">
          <div className="realityIcon"><UiIcon name="shield" size={20}/></div>
          <div><b>هذه ملفات توضيحية وليست خبراء منشورين فعليًا.</b><p>لن يظهر أي خبير للعامة قبل إكمال طلبه واعتماده. نستخدم هذه النماذج لبناء تجربة المنتج دون اختلاق Social Proof.</p></div>
          <Link href="/become-a-mentor" className="textLink">تقدّم كخبير <UiIcon name="arrow" size={16}/></Link>
        </div>
      </section>
    </main>
  );
}
