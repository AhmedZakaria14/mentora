import { MentorCard } from "@/components/MentorCard";
import { demoMentors } from "@/lib/demo-data";

export const metadata = { title: "استكشف الخبراء" };
export default function ExplorePage(){return <main className="shell"><div className="pageHero"><div className="eyebrow">شبكة الخبراء</div><h1>ابحث عن الشخص المناسب لمشكلتك</h1><p className="muted">فلترة حسب المجال والخبرة واللغة والسعر والتوفر.</p></div><div className="problemBox" style={{marginBottom:28}}><input aria-label="بحث" placeholder="ابحث: SEO، Meta Ads، إدارة منتج..." style={{width:'100%',border:0,outline:0,font:'inherit',padding:8}}/></div><div className="mentorGrid" style={{paddingBottom:70}}>{demoMentors.map(m=><MentorCard key={m.id} mentor={m}/>)}</div></main>}
