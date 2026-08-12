import Link from "next/link";
import { HomeMotion } from "@/components/HomeMotion";
import { UiIcon } from "@/components/UiIcon";
import { demoMentors } from "@/lib/demo-data";

const problems = [
  "إعلاناتي تصرف ولا تحقق مبيعات",
  "أحتاج خطة إطلاق واضحة لمنتجي",
  "موقعي لا يظهر في نتائج Google",
  "لا أعرف كيف أسعّر خدمتي",
];

const categories = [
  { icon: "chart" as const, title: "التسويق والنمو", text: "Growth، Funnels، CRO، Performance" },
  { icon: "target" as const, title: "الإعلانات والمبيعات", text: "Meta Ads، Google Ads، Sales" },
  { icon: "code" as const, title: "المنتج والتقنية", text: "Product، AI، UX، Analytics" },
  { icon: "briefcase" as const, title: "الأعمال وريادة الشركات", text: "GTM، Pricing، Operations" },
  { icon: "search" as const, title: "SEO والمحتوى", text: "SEO، Content، Search Strategy" },
  { icon: "users" as const, title: "القيادة والمسار المهني", text: "Leadership، Hiring، Career" },
];

const steps = [
  { n: "01", icon: "message" as const, title: "اشرح التحدي", text: "اكتب ما يحدث بطريقتك. لا تحتاج أن تعرف اسم التخصص أو الحل مسبقًا." },
  { n: "02", icon: "users" as const, title: "اختر الخبير", text: "قارن الخبرة، المهارات، السعر والموعد، وافهم لماذا هذا الشخص مناسب لمشكلتك." },
  { n: "03", icon: "calendar" as const, title: "احجز الوقت", text: "اختر الموعد المناسب حسب منطقتك الزمنية، ثم ثبّت الجلسة بخطوات واضحة." },
  { n: "04", icon: "video" as const, title: "التقِ ونفّذ", text: "ادخل الجلسة عبر Google Meet واخرج بقرار واضح وخطوات عملية قابلة للتنفيذ." },
];

export default function Home() {
  const featured = demoMentors.slice(0, 3);

  return (
    <main className="homePage">
      <HomeMotion />

      <section className="proNotice" aria-label="تعريف بالمنصة">
        <div className="shell proNoticeInner">
          <span className="noticeDot" />
          <span>منصة عربية لجلسات الخبرة الخاصة 1:1</span>
          <Link href="/how-it-works">اعرف كيف تعمل <UiIcon name="arrow" size={15} /></Link>
        </div>
      </section>

      <section className="proHero">
        <div className="heroGlow heroGlowA" />
        <div className="heroGlow heroGlowB" />
        <div className="shell proHeroGrid">
          <div className="proHeroCopy" data-reveal>
            <div className="eyebrowPill"><UiIcon name="spark" size={16} /> خبرة مناسبة، في الوقت المناسب</div>
            <h1>لا تبحث عن نصيحة عامة.<br/><span>تحدث مع شخص فعلها قبلك.</span></h1>
            <p className="proHeroLead">Mentora توصلك بخبير مناسب لمشكلتك الفعلية، لجلسة خاصة مركّزة تساعدك على اتخاذ قرار أفضل والتحرك بخطوات واضحة.</p>

            <form className="proSearchCard" action="/explore">
              <label htmlFor="problem">ما الذي تريد حله الآن؟</label>
              <div className="proSearchInput">
                <UiIcon name="search" size={22} />
                <textarea id="problem" name="q" placeholder="مثال: تكلفة الإعلانات ارتفعت والمبيعات ثابتة، ولا أعرف أين المشكلة…" />
              </div>
              <div className="proSearchBottom">
                <div className="proSearchTrust"><UiIcon name="shield" size={16} /><span>خبراء يخضعون للمراجعة قبل الظهور</span></div>
                <button className="btn proPrimary" type="submit">اعثر على الخبير المناسب <UiIcon name="arrow" size={18} /></button>
              </div>
            </form>

            <div className="quickProblems" aria-label="أمثلة للبحث">
              <span>جرّب:</span>
              {problems.map((problem) => <Link key={problem} href={`/explore?q=${encodeURIComponent(problem)}`}>{problem}</Link>)}
            </div>
          </div>

          <div className="proHeroVisual" data-reveal aria-label="معاينة تجربة Mentora">
            <div className="visualBackdrop" />
            <div className="matchPanel">
              <div className="matchPanelTop">
                <div><span className="miniBrand">M</span><b>مطابقة الخبراء</b></div>
                <span className="softStatus"><span /> متاح الآن</span>
              </div>
              <div className="matchQuestion">“أحتاج شخصًا يفهم نمو المتاجر والإعلانات ويعطيني رأيًا عمليًا.”</div>
              <div className="matchedExpert featuredMatch">
                <div className="expertAvatar">أح</div>
                <div className="expertMain"><div><strong>أحمد حسن</strong><span className="verifiedDot"><UiIcon name="check" size={11}/></span></div><p>Growth & Performance Marketing</p><small>Meta Ads · Funnels · Ecommerce</small></div>
                <div className="matchBadge">96%<small>تطابق</small></div>
              </div>
              <div className="matchedExpert">
                <div className="expertAvatar expertAvatarAlt">سق</div>
                <div className="expertMain"><strong>سارة القحطاني</strong><p>Product & Startup Strategy</p></div>
                <div className="matchBadge subtle">91%<small>تطابق</small></div>
              </div>
              <div className="whyMatch"><UiIcon name="spark" size={18}/><div><b>لماذا هذا الترشيح؟</b><p>خبرة في نفس نوع التحدي، لغة مناسبة، وموعد قريب.</p></div></div>
            </div>

            <div className="bookingFloat">
              <div className="bookingFloatIcon"><UiIcon name="calendar" size={19}/></div>
              <div><small>أقرب موعد</small><strong>اليوم · 7:30 م</strong></div>
            </div>
            <div className="meetFloat">
              <div className="meetFloatTop"><span><i /> جلسة مؤكدة</span><UiIcon name="video" size={18}/></div>
              <strong>مراجعة استراتيجية النمو</strong>
              <small>45 دقيقة · Google Meet</small>
              <div className="meetPeople"><span>أنت</span><span>أح</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="proofBand">
        <div className="shell proofGrid">
          <div><UiIcon name="shield"/><span><b>مراجعة الخبراء</b><small>ملفات لا تظهر للعامة قبل الاعتماد</small></span></div>
          <div><UiIcon name="clock"/><span><b>موعد واضح</b><small>حسب منطقتك الزمنية</small></span></div>
          <div><UiIcon name="video"/><span><b>Google Meet</b><small>رابط الجلسة بعد التأكيد</small></span></div>
          <div><UiIcon name="target"/><span><b>جلسة مركّزة</b><small>على مشكلتك أنت، لا محتوى عام</small></span></div>
        </div>
      </section>

      <section className="proSection featuredExperts">
        <div className="shell">
          <div className="sectionHeading splitHeading" data-reveal>
            <div><span className="sectionKicker">استكشف الخبراء</span><h2>اعثر على خبرة تعرف طريق المشكلة.</h2><p>هذه الملفات المعروضة حاليًا نماذج توضيحية للواجهة إلى أن يتم اعتماد الخبراء الحقيقيين.</p></div>
            <Link href="/explore" className="textLink">عرض كل الخبراء <UiIcon name="arrow" size={17}/></Link>
          </div>
          <div className="proExpertGrid">
            {featured.map((mentor, index) => (
              <Link href={`/mentors/${mentor.slug}`} className="proExpertCard" key={mentor.id} data-reveal>
                <div className="expertCardTop">
                  <div className={`profileAvatar avatarTone${index + 1}`}>{mentor.name.split(" ").map((part) => part[0]).join("")}</div>
                  <span className="demoChip">نموذج</span>
                </div>
                <div className="expertIdentity"><h3>{mentor.name}<span className="verifiedDot"><UiIcon name="check" size={11}/></span></h3><p>{mentor.headline}</p></div>
                <div className="proSkills">{mentor.skills.slice(0,3).map((skill) => <span key={skill}>{skill}</span>)}</div>
                <div className="expertAvailability"><span className="availabilityDot"/><span>أقرب موعد: {mentor.nextAvailable}</span></div>
                <div className="expertCardBottom"><div><small>تبدأ الجلسة من</small><strong>{mentor.priceFrom} {mentor.currency}</strong></div><span className="circleArrow"><UiIcon name="arrow" size={18}/></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="proSection problemSection">
        <div className="shell problemLayout">
          <div className="problemIntro" data-reveal><span className="sectionKicker">ابدأ من المشكلة</span><h2>لا تحتاج أن تعرف اسم التخصص الذي تبحث عنه.</h2><p>صف الموقف كما هو. البحث في Mentora مصمم حول ما تريد حله، ثم يمكنك تضييق النتائج بالمهارة، السعر، اللغة والموعد.</p><Link href="/explore" className="btn secondaryBtn">ابدأ البحث <UiIcon name="arrow" size={18}/></Link></div>
          <div className="problemCards">
            {problems.map((problem, index) => <Link data-reveal href={`/explore?q=${encodeURIComponent(problem)}`} key={problem} className="problemCard"><span>0{index + 1}</span><p>{problem}</p><UiIcon name="arrow" size={18}/></Link>)}
          </div>
        </div>
      </section>

      <section className="proSection processSection">
        <div className="shell">
          <div className="sectionHeading centered" data-reveal><span className="sectionKicker">كيف تعمل Mentora؟</span><h2>من سؤال مربك إلى خطوة واضحة.</h2><p>تدفق بسيط، بدون تعقيد غير ضروري، حتى تصل إلى الجلسة التي تحتاجها بسرعة.</p></div>
          <div className="processGrid">
            {steps.map((step) => <article className="processCard" data-reveal key={step.n}><div className="processIcon"><UiIcon name={step.icon} size={23}/></div><span className="processNumber">{step.n}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="proSection categoryProSection">
        <div className="shell">
          <div className="sectionHeading splitHeading" data-reveal><div><span className="sectionKicker">مجالات الخبرة</span><h2>خبرة عملية عبر أهم القرارات المهنية.</h2></div><Link href="/explore" className="textLink">كل المجالات <UiIcon name="arrow" size={17}/></Link></div>
          <div className="categoryProGrid">
            {categories.map((category) => <Link data-reveal href={`/explore?q=${encodeURIComponent(category.title)}`} className="categoryProCard" key={category.title}><div className="categoryIconPro"><UiIcon name={category.icon} size={22}/></div><div><h3>{category.title}</h3><p>{category.text}</p></div><UiIcon name="arrow" size={18}/></Link>)}
          </div>
        </div>
      </section>

      <section className="proSection valueSection">
        <div className="shell valueGrid">
          <div className="valueCopy" data-reveal><span className="sectionKicker lightKicker">لماذا جلسة 1:1؟</span><h2>لأن القرار الحقيقي يحتاج سياقك أنت.</h2><p>المقال أو الفيديو يشرح الفكرة. الجلسة الخاصة تسمح للخبير أن يسمع التفاصيل، يسأل عن القيود، ويعطيك رأيًا مرتبطًا بوضعك الحالي.</p><div className="valueChecks"><span><UiIcon name="check" size={16}/> وقتك مخصص لمشكلتك</span><span><UiIcon name="check" size={16}/> يمكنك مشاركة الأرقام والسياق</span><span><UiIcon name="check" size={16}/> تخرج بقرار وخطوات تالية</span></div></div>
          <div className="valuePanel" data-reveal><div className="valuePanelHeader"><span>بعد الجلسة</span><span className="softStatus darkStatus"><span/> مكتمل</span></div><div className="actionItem"><span>01</span><div><b>القرار الأساسي</b><p>اختبر العرض الحالي قبل زيادة ميزانية الإعلانات.</p></div></div><div className="actionItem"><span>02</span><div><b>التجربة التالية</b><p>أنشئ صفحة هبوط جديدة برسالة واحدة واختبرها 7 أيام.</p></div></div><div className="actionItem"><span>03</span><div><b>ما الذي سنراجعه لاحقًا؟</b><p>نسبة التحويل، تكلفة الاكتساب، وجودة العملاء المحتملين.</p></div></div></div>
        </div>
      </section>

      <section className="mentorInvite">
        <div className="shell mentorInviteInner" data-reveal>
          <div className="mentorInviteIcon"><UiIcon name="users" size={30}/></div>
          <div><span className="sectionKicker lightKicker">للخبراء والمستشارين</span><h2>حوّل خبرتك إلى جلسات لها أثر واضح.</h2><p>أنشئ ملفك، حدد خدماتك وأسعارك وتوافرك، واستقبل حجوزات من أشخاص يبحثون عن خبرتك تحديدًا.</p></div>
          <Link href="/become-a-mentor" className="btn whiteBtn">تقدّم كخبير <UiIcon name="arrow" size={18}/></Link>
        </div>
      </section>

      <section className="finalProCta">
        <div className="shell finalProInner" data-reveal>
          <div><span className="sectionKicker">ابدأ من تحديك الحالي</span><h2>هناك فرق بين معرفة المعلومة ومعرفة ماذا تفعل الآن.</h2><p>اعثر على الشخص الأقرب لمشكلتك، وافهم خبرته قبل أن تحجز.</p></div>
          <Link href="/explore" className="btn proPrimary">استكشف الخبراء <UiIcon name="arrow" size={18}/></Link>
        </div>
      </section>
    </main>
  );
}
