import Link from "next/link";
import type { MentorCard as Mentor } from "@/lib/types";
import { UiIcon } from "@/components/UiIcon";

export function MentorCard({ mentor }: { mentor: Mentor }) {
  const initials = mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <article className="mentorCard resultExpertCard">
      <div className="mentorTop resultExpertTop">
        <div className="avatar resultAvatar">{initials}</div>
        <div className="resultIdentity">
          <div className="mentorName">
            {mentor.name}
            {mentor.verified ? <span className="verified resultVerified"><UiIcon name="check" size={11}/></span> : null}
          </div>
          <p>{mentor.headline}</p>
          <span className="demoInline">ملف تجريبي</span>
        </div>
      </div>

      <div className="skillRow resultSkills">
        {mentor.skills.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}
      </div>

      <div className="mentorMeta resultMeta">
        <span>{mentor.country}</span>
        <span>{mentor.languages.slice(0,2).join(" · ")}</span>
        <span>{mentor.sessions} جلسة تجريبية</span>
      </div>

      <div className="availability resultAvailability">
        <span className="dot" />
        <span>أقرب موعد: <b>{mentor.nextAvailable}</b></span>
      </div>

      <div className="mentorBottom resultBottom">
        <div><small>تبدأ الجلسة من</small><strong>{mentor.priceFrom} {mentor.currency}</strong></div>
        <Link className="btn small resultCta" href={`/mentors/${mentor.slug}`}>عرض الملف <UiIcon name="arrow" size={16}/></Link>
      </div>
    </article>
  );
}
