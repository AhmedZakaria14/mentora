import Link from "next/link";
import { notFound } from "next/navigation";
import { demoMentors } from "@/lib/demo-data";
import { UiIcon } from "@/components/UiIcon";

export default async function MentorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mentor = demoMentors.find((item) => item.slug === slug);
  if (!mentor) return notFound();

  const initials = mentor.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

  return (
    <main className="mentorProfilePage">
      <section className="mentorProfileHero">
        <div className="shell mentorProfileHeroInner">
          <div className="mentorProfileAvatar">{initials}</div>
          <div className="mentorProfileIdentity">
            <div className="profileFlags"><span className="demoProfileFlag">ملف تجريبي</span><span className="reviewFlag"><UiIcon name="shield" size={14}/> نموذج لخبير معتمد</span></div>
            <h1>{mentor.name}</h1>
            <p>{mentor.headline}</p>
            <div className="profileMetaLine"><span>{mentor.country}</span><i/><span>{mentor.languages.join(" · ")}</span><i/><span>جلسات 1:1</span></div>
          </div>
        </div>
      </section>

      <div className="shell mentorProfileLayout">
        <div className="mentorProfileMain">
          <section className="profileSection fitSection">
            <span className="profileSectionLabel">مناسب لك إذا</span>
            <h2>تحتاج رأيًا عمليًا في هذه المجالات.</h2>
            <div className="profileSkills">
              {mentor.skills.map((skill) => <span key={skill}><UiIcon name="check" size={14}/>{skill}</span>)}
            </div>
          </section>

          <section className="profileSection">
            <span className="profileSectionLabel">عن الخبير</span>
            <h2>خبرة تُترجم إلى قرار واضح.</h2>
            <p className="profileBody">هذا النص تجريبي لبناء واجهة Mentora. في النسخة الفعلية سيعرض الخبير خبرته العملية، نوع المشكلات التي يحلها، القطاعات التي عمل معها، وما الذي يمكن للمتعلم توقعه من الجلسة بدون مبالغات أو وعود غير قابلة للتحقق.</p>
            <div className="profilePrinciples">
              <div><UiIcon name="target" size={20}/><span><b>جلسة مركزة</b><small>نبدأ بالسؤال والنتيجة التي تريد الوصول إليها.</small></span></div>
              <div><UiIcon name="message" size={20}/><span><b>حوار مباشر</b><small>يمكنك مشاركة السياق والأرقام والقيود بدل نصيحة عامة.</small></span></div>
              <div><UiIcon name="check" size={20}/><span><b>خطوة تالية</b><small>الهدف أن تنتهي الجلسة وأنت تعرف ماذا تفعل بعدها.</small></span></div>
            </div>
          </section>

          <section className="profileSection serviceSection">
            <span className="profileSectionLabel">الخدمة المتاحة</span>
            <div className="serviceProfileCard">
              <div className="serviceIcon"><UiIcon name="video" size={22}/></div>
              <div className="serviceCopy"><h3>جلسة استراتيجية خاصة 1:1</h3><p>جلسة مباشرة لمراجعة تحدٍ واحد بعمق ووضع مسار عمل واضح.</p><div><span><UiIcon name="clock" size={14}/> 60 دقيقة</span><span><UiIcon name="video" size={14}/> Google Meet</span></div></div>
              <div className="servicePrice"><small>سعر تجريبي</small><strong>{mentor.priceFrom} {mentor.currency}</strong></div>
            </div>
          </section>

          <section className="profileSection reviewPlaceholder">
            <span className="profileSectionLabel">التقييمات</span>
            <div className="emptyReviewState"><UiIcon name="message" size={23}/><div><h3>لن نعرض تقييمات تجريبية على أنها حقيقية.</h3><p>عند بدء الجلسات الفعلية ستظهر هنا تقييمات العملاء الموثقة المرتبطة بحجوزات مكتملة فقط.</p></div></div>
          </section>
        </div>

        <aside className="bookingSidebar">
          <div className="bookingProfileCard">
            <div className="bookingCardHead"><span>احجز جلسة</span><span className="availabilityBadge"><i/> موعد متاح</span></div>
            <div className="bookingPrice"><small>تبدأ من</small><strong>{mentor.priceFrom} {mentor.currency}</strong><span>للجلسة التجريبية</span></div>
            <div className="bookingFacts">
              <div><UiIcon name="clock" size={18}/><span><small>المدة</small><b>60 دقيقة</b></span></div>
              <div><UiIcon name="calendar" size={18}/><span><small>أقرب موعد</small><b>{mentor.nextAvailable}</b></span></div>
              <div><UiIcon name="video" size={18}/><span><small>مكان الجلسة</small><b>Google Meet</b></span></div>
            </div>
            <Link className="btn bookingPrimary" href={`/login?next=${encodeURIComponent(`/mentors/${mentor.slug}`)}`}>سجّل الدخول لاختيار موعد <UiIcon name="arrow" size={17}/></Link>
            <div className="bookingTrust"><UiIcon name="shield" size={16}/><p>لن يتم إنشاء موعد Meet أو حجز وقت نهائي إلا بعد إكمال مسار الحجز والتأكيد.</p></div>
          </div>
          <Link href="/explore" className="backToResults"><UiIcon name="arrow" size={15}/> العودة إلى نتائج الخبراء</Link>
        </aside>
      </div>
    </main>
  );
}
