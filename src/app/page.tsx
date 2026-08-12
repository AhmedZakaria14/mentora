import Link from "next/link";
import { MentorCard } from "@/components/MentorCard";
import { demoMentors } from "@/lib/demo-data";
import { appConfig } from "@/lib/config";

const categories = ["التسويق والنمو", "الأعمال والاستراتيجية", "البرمجة والذكاء الاصطناعي", "المبيعات", "SEO", "القيادة والإدارة"];

export default function Home() {
  return <main>
    <section className="hero"><div className="shell heroGrid"><div>
      <div className="eyebrow">إرشاد شخصي 1:1 • خبراء تم التحقق منهم</div>
      <h1>{appConfig.taglineAr}<br/><span>تحدث مع شخص فعلها قبلك.</span></h1>
      <p className="lead">بدل أسابيع من البحث والتجربة، اشرح ما تريد تحقيقه وسنوصلك بخبير مناسب لجلسة عملية ومباشرة.</p>
      <div className="problemBox"><label>ما الذي تحتاج مساعدة فيه؟</label><textarea placeholder="مثال: عندي متجر إلكتروني وإعلاناتي تجلب زيارات لكن المبيعات ضعيفة..."/><div className="problemActions"><span>✨ مطابقة ذكية بالخبرة والمشكلة والتوفر</span><Link href="/explore" className="btn">ابحث عن خبير مناسب ←</Link></div></div>
      <div className="trustRow"><span>✓ حجز فوري</span><span>✓ Google Meet</span><span>✓ دفع آمن</span><span>✓ متابعة بعد الجلسة</span></div>
    </div><div className="heroPanel"><div className="heroPanelHeader"><span>موعدك القادم</span><span className="live">● مؤكد</span></div><div className="meetingCard"><div className="bigAvatar">أح</div><div><b>جلسة استراتيجية نمو</b><p>مع أحمد حسن</p></div></div><div className="meetingDetails"><div><small>التاريخ</small><b>الأربعاء، 12 أغسطس</b></div><div><small>الوقت</small><b>7:30 م • القاهرة</b></div></div><button className="meetButton">🎥 الانضمام عبر Google Meet</button><div className="agenda"><b>قبل الجلسة</b><p>✓ هدف الجلسة مكتمل</p><p>✓ تم إعداد أجندة ذكية</p></div></div></div></section>

    <section className="section shell"><div className="sectionHead"><div><span className="eyebrow">استكشف حسب احتياجك</span><h2>خبير مناسب لكل تحدٍ</h2></div><Link href="/explore">عرض جميع التخصصات ←</Link></div><div className="categoryGrid">{categories.map((c,i)=><Link href="/explore" className="category" key={c}><span className="categoryIcon">{["↗","◫","⌘","◎","⌕","♟"][i]}</span><b>{c}</b><small>خبراء وجلسات متخصصة</small></Link>)}</div></section>

    <section className="section alt"><div className="shell"><div className="sectionHead"><div><span className="eyebrow">خبراء مقترحون</span><h2>ابدأ مع شخص لديه الخبرة التي تحتاجها</h2></div><Link href="/explore">استكشف الكل ←</Link></div><div className="mentorGrid">{demoMentors.map(m => <MentorCard key={m.id} mentor={m}/>)}</div></div></section>

    <section className="section shell"><div className="steps"><div><span>01</span><h3>اشرح هدفك</h3><p>اكتب مشكلتك أو ما تريد تعلمه باللغة الطبيعية.</p></div><div><span>02</span><h3>اختر الخبير</h3><p>قارن الخبرة والأسعار والتقييمات وأقرب موعد.</p></div><div><span>03</span><h3>احجز الجلسة</h3><p>اختر الوقت المناسب وسيتم إنشاء الموعد وGoogle Meet.</p></div><div><span>04</span><h3>اخرج بخطة</h3><p>ملخص الجلسة والخطوات العملية والمتابعة في مكان واحد.</p></div></div></section>

    <section className="cta"><div className="shell ctaInner"><div><span className="eyebrow light">لديك خبرة تستحق المشاركة؟</span><h2>حوّل خبرتك إلى أثر ودخل.</h2><p>انضم إلى شبكة خبرائنا، حدد أسعارك ومواعيدك، ونحن نهتم بالحجز والتجربة.</p></div><Link href="/become-a-mentor" className="btn white">قدّم كخبير</Link></div></section>
  </main>
}
