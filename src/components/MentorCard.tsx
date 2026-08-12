import Link from "next/link";
import type { MentorCard as Mentor } from "@/lib/types";

export function MentorCard({ mentor }: { mentor: Mentor }) {
  const initials = mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return <article className="mentorCard">
    <div className="mentorTop"><div className="avatar">{initials}</div><div><div className="mentorName">{mentor.name} {mentor.verified && <span className="verified">✓</span>}</div><p>{mentor.headline}</p></div></div>
    <div className="skillRow">{mentor.skills.slice(0,3).map(skill => <span key={skill}>{skill}</span>)}</div>
    <div className="mentorMeta"><span>★ {mentor.rating}</span><span>{mentor.sessions} جلسة</span><span>{mentor.country}</span></div>
    <div className="availability"><span className="dot"/> أقرب موعد: {mentor.nextAvailable}</div>
    <div className="mentorBottom"><div><small>تبدأ من</small><strong>{mentor.priceFrom} {mentor.currency}</strong></div><Link className="btn small" href={`/mentors/${mentor.slug}`}>عرض الملف والحجز</Link></div>
  </article>
}
