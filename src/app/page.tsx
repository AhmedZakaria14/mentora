import Link from "next/link";
import { HomeMotion } from "@/components/HomeMotion";
import { demoMentors } from "@/lib/demo-data";

const problemTopics = [
  ["إعلاناتي تصرف ولا تبيع", "الإعلانات المدفوعة"],
  ["لا أعرف كيف أسعّر خدمتي", "التسعير"],
  ["أحتاج خطة Go-to-Market", "الاستراتيجية"],
  ["موقعي لا يظهر في Google", "SEO"],
  ["أريد إطلاق منتجي بشكل صحيح", "إطلاق المنتجات"],
  ["أحتاج رأيًا خبيرًا قبل قرار مهم", "إدارة وقيادة"],
];

const categories = [
  ["↗", "التسويق والنمو", "Growth، Funnels، CRO، المحتوى"],
  ["◎", "الإعلانات والمبيعات", "Meta Ads، Google Ads، Sales"],
  ["⌘", "المنتج والتقنية", "Product، AI، UX، Analytics"],
  ["◫", "الشركات وريادة الأعمال", "GTM، Pricing، Fundraising"],
  ["⌁", "SEO والمحتوى", "SEO، Content، Search Strategy"],
  ["♟", "القيادة والمسار المهني", "Leadership، Hiring، Career"],
];

export default function Home() {
  return (
    <main className="homePage">
      <HomeMotion />

      <section className="gmHero">
        <div className="heroOrb heroOrbOne" />
        <div className="heroOrb heroOrbTwo" />
        <div className="shell gmHeroGrid">
          <div className="gmHeroCopy" data-reveal>
            <div className="launchBadge"><span className="statusPulse" /> منصة عربية لجلسات الخبرة 1:1</div>
            <h1>التقدّم يصبح أسهل<br/><span>عندما لا تحاول وحدك.</span></h1>
            <p className="heroLead">تحدث مع خبير سبق أن واجه المشكلة التي تواجهها الآن. جلسة مركّزة، نصيحة عملية، وخطوات تعرف ماذا تفعل بعدها.</p>

            <form className="heroMatchBox" action="/explore">
              <div className="heroMatchLabel"><span>✨</span><div><b>ما الذي يوقفك الآن؟</b><small>اكتبها بطريقتك، وسنوجّهك إلى الخبرة المناسبة.</small></div></div>
              <textarea name="q" aria-label="صف المشكلة التي تريد مساعدة فيها" placeholder="مثال: تكلفة الإعلان ارتفعت والمبيعات لم تتحسن، ولا أعرف هل المشكلة في العرض أم صفحة الهبوط…" />
              <div className="heroMatchFooter">
                <div className="miniTrust"><span>مطابقة ذكية</span><span>•</span><span>خبراء موثّقون</span></div>
                <button className="btn heroPrimary" type="submit">اعثر على خبير مناسب <span>←</span></button>
              </div>
            </form>

            <div className="heroProofLine">
              <div className="avatarStack" aria-hidden="true"><span>أ</span><span>س</span><span>ع</span><span>ل</span></div>
              <p><b>خبرة متعددة بدل رأي واحد.</b> اختر الخبير المناسب لكل مشكلة، في الوقت الذي تحتاجه.</p>
            </div>
          </div>

          <div className="heroProductScene" data-reveal>
            <div className="sceneGrid" />
            <div className="floatingLabel floatingLabelTop">متاح اليوم • 7:30 م</div>
            <div className="mentorMatchWindow">
              <div className="windowTop"><div className="windowDots"><i/><i/><i/></div><span>Mentora AI Match</span><b>96% توافق</b></div>
              <div className="queryBubble">أحتاج شخصًا يفهم نمو المتاجر والإعلانات، ويفضل أن يتحدث العربية.</div>
              <div className="matchCard primaryMatch">
                <div className="matchAvatar">أح</div>
                <div><strong>أحمد حسن</strong><span>Growth & Performance</span><small>Meta Ads • Funnels • Ecommerce</small></div>
                <button aria-label="اختيار أحمد">←</button>
              </div>
              <div className="matchCard fadedMatch">
                <div className="matchAvatar peach">سق</div><div><strong>سارة القحطاني</strong><span>Product & Startup</span></div><em>91%</em>
              </div>
              <div className="matchReason"><span>✦</span><p><b>لماذا هذا التطابق؟</b><br/>خبرة عملية في نفس نوع التحدي + موعد قريب + اللغة المناسبة.</p></div>
            </div>
            <div className="sessionFloatCard">
              <span className="sessionLive"><i/> جلسة مباشرة</span>
              <strong>استراتيجية النمو</strong>
              <small>45 دقيقة • Google Meet</small>
              <div className="sessionFaces"><span>أنت</span><span>أح</span></div>
            </div>
            <div className="floatingLabel floatingLabelBottom">✓ تم إعداد ملخص الجلسة</div>
          </div>
        </div>
      </section>

      <section className="trustRibbon">
        <div className="shell trustRibbonInner">
          <span>خبير تم التحقق منه</span><i/> <span>جلسة مباشرة 1:1</span><i/> <span>Google Meet</span><i/> <span>مواعيد حسب منطقتك الزمنية</span><i/> <span>ملخص وخطوات بعد الجلسة</span>
        </div>
      </section>

      <section className="homeSection howSection">
        <div className="shell">
          <div className="centerHeading" data-reveal><span className="kicker">كيف تعمل Mentora؟</span><h2>من “أنا عالق” إلى “أعرف الخطوة التالية”.</h2><p>بنية بسيطة تجعل الخبرة تصل إليك عندما تحتاجها، لا بعد أسابيع من البحث.</p></div>
          <div className="journeyGrid">
            <article className="journeyCard matchJourney" data-reveal>
              <span className="stepNumber">1</span><div className="journeyTitle"><small>AI Matching</small><h3>اشرح مشكلتك كما هي</h3></div>
              <div className="miniMatchUi"><p>“أريد تحسين التحويل بدون زيادة ميزانية الإعلانات.”</p><div><span>96%</span><b>Growth & CRO</b><small>تطابق قوي</small></div><div><span>92%</span><b>Ecommerce</b><small>متاح غدًا</small></div></div>
              <p className="journeyCopy">نرشح الخبرة الأقرب لهدفك، مع إمكانية التصفية حسب المهارة والسعر واللغة والموعد.</p>
            </article>
            <article className="journeyCard callJourney" data-reveal>
              <span className="stepNumber">2</span><div className="journeyTitle"><small>جلسة 1:1</small><h3>تحدث مع شخص فعلها قبلك</h3></div>
              <div className="callMock"><div className="callPerson"><span>أح</span><b>جلسة مباشرة</b></div><div className="callTimer">28:42</div><div className="waveform">{Array.from({length:18}).map((_,i)=><i key={i}/>)}</div></div>
              <p className="journeyCopy">جلسة مركزة على مشكلتك أنت، بعيدًا عن المحتوى العام والنصائح المكررة.</p>
            </article>
            <article className="journeyCard recapJourney" data-reveal>
              <span className="stepNumber">3</span><div className="journeyTitle"><small>بعد الجلسة</small><h3>اخرج بخطة قابلة للتنفيذ</h3></div>
              <div className="recapMock"><div><span>✓</span><p><b>القرار</b> ابدأ بتحسين العرض قبل زيادة الميزانية.</p></div><div><span>→</span><p><b>التالي</b> اختبر صفحة هبوط جديدة خلال 7 أيام.</p></div><div><span>✦</span><p><b>ملخص ذكي</b> أهم النقاط محفوظة داخل حسابك.</p></div></div>
              <p className="journeyCopy">احتفظ بالنتيجة والخطوات في مكان واحد وارجع للخبير عند الحاجة.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="problemStripSection">
        <div className="shell" data-reveal>
          <div className="problemStripHead"><span className="kicker">أمثلة لما يمكنك أن تأتي به</span><h2>لا تحتاج أن تعرف اسم التخصص. فقط أخبرنا بما يحدث.</h2></div>
          <div className="problemPills">{problemTopics.map(([problem,topic])=><Link href={`/explore?q=${encodeURIComponent(problem)}`} key={problem}><b>“{problem}”</b><span>→ {topic}</span></Link>)}</div>
        </div>
      </section>

      <section className="homeSection explorerSection">
        <div className="shell explorerGrid">
          <div className="explorerCopy" data-reveal><span className="kicker">استكشف شبكة الخبراء</span><h2>مشكلة مختلفة؟ اختر خبيرًا مختلفًا.</h2><p>ليس الهدف أن تجد “مرشدًا واحدًا لكل شيء”. الشخص المناسب للتسعير قد لا يكون هو الأنسب للإعلانات أو المنتج. Mentora مصممة لتصل إلى الخبرة المناسبة لكل قرار.</p><ul><li>تصفية حسب المهارة والتخصص</li><li>اللغة والدولة والمنطقة الزمنية</li><li>السعر وأقرب موعد متاح</li><li>ملفات شخصية واضحة قبل الحجز</li></ul><Link href="/explore" className="btn">استكشف الخبراء <span>←</span></Link></div>
          <div className="explorerMock" data-reveal>
            <div className="explorerSearch"><span>⌕</span><p>ابحث بالاسم أو المهارة…</p><kbd>⌘ K</kbd></div>
            <div className="filterRow"><span>المهارة</span><span>الدولة</span><span>اللغة</span><span>الموعد</span></div>
            <div className="demoNotice">نماذج توضيحية للواجهة حتى يتم اعتماد الخبراء الحقيقيين</div>
            {demoMentors.slice(0,3).map((mentor,index)=><Link href={`/mentors/${mentor.slug}`} className="explorerMentor" key={mentor.id}><div className={`explorerAvatar tone${index+1}`}>{mentor.name.split(" ").map(n=>n[0]).join("")}</div><div><strong>{mentor.name}<i>✓</i></strong><p>{mentor.headline}</p><small>{mentor.skills.slice(0,3).join(" • ")}</small></div><div className="explorerMeta"><b>{mentor.priceFrom} {mentor.currency}</b><span>{mentor.nextAvailable}</span></div></Link>)}
          </div>
        </div>
      </section>

      <section className="homeSection categorySection">
        <div className="shell"><div className="sectionSplitHeading" data-reveal><div><span className="kicker">ابحث حسب المجال</span><h2>خبرة عملية في التحديات التي تواجهك يوميًا.</h2></div><Link href="/explore">عرض كل التخصصات ←</Link></div><div className="modernCategoryGrid">{categories.map(([icon,title,desc])=><Link href={`/explore?q=${encodeURIComponent(title)}`} className="modernCategory" key={title} data-reveal><span>{icon}</span><div><h3>{title}</h3><p>{desc}</p></div><b>←</b></Link>)}</div></div>
      </section>

      <section className="networkSection">
        <div className="shell networkInner" data-reveal>
          <div className="networkVisual"><div className="orbit orbitOne"><i>SEO</i><i>AI</i><i>GTM</i></div><div className="orbit orbitTwo"><i>Ads</i><i>UX</i><i>Sales</i></div><div className="networkCenter">M<span>.</span></div></div>
          <div className="networkCopy"><span className="kicker lightKicker">شبكة لا فرد واحد</span><h2>ابنِ حولك دائرة خبرة، بدل أن تتخذ كل قرار وحدك.</h2><p>احجز جلسة عندما تحتاج رأيًا متخصصًا، ثم عد بخبير آخر عندما تتغير المشكلة. مع الوقت يصبح لديك سجل قرارات، جلسات، ملخصات وأشخاص تعرف متى تستعين بهم.</p><div className="networkFeatures"><span>✓ جلسات منفردة</span><span>✓ باقات متعددة</span><span>✓ متابعة مستمرة</span></div></div>
        </div>
      </section>

      <section className="homeSection mentorJoinSection">
        <div className="shell mentorJoin" data-reveal><div><span className="kicker">لديك خبرة حقيقية؟</span><h2>حوّل ما تعلمته خلال سنوات إلى أثر في جلسة واحدة.</h2><p>أنشئ ملفك، حدد تخصصاتك ومواعيدك وأسعارك، واستقبل أشخاصًا يحتاجون خبرتك بالفعل. كل خبير يمر بمراجعة قبل ظهوره للعامة.</p><div className="joinSteps"><span><b>01</b> قدّم بياناتك</span><span><b>02</b> مراجعة واعتماد</span><span><b>03</b> ابدأ استقبال الجلسات</span></div></div><Link href="/become-a-mentor" className="btn darkBtn">قدّم كخبير ←</Link></div>
      </section>

      <section className="finalHomeCta">
        <div className="shell finalCtaInner" data-reveal><span className="kicker lightKicker">ابدأ بالمشكلة، لا بالبحث</span><h2>هناك شخص سبق أن حل ما أنت عالق فيه الآن.</h2><p>أخبر Mentora بما تريد تحقيقه، واعثر على الخبير الأقرب إلى هدفك.</p><div><Link href="/explore" className="btn whiteBtn">اعثر على خبير</Link><Link href="/how-it-works" className="textCta">شاهد كيف تعمل المنصة ←</Link></div></div>
      </section>
    </main>
  );
}
