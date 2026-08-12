"use client";

import { FormEvent, useEffect, useState } from "react";

type FormState = {
  headline: string;
  bio: string;
  years_experience: string;
  current_company: string;
  current_title: string;
  linkedin_url: string;
  website_url: string;
  portfolio_url: string;
  intro_video_url: string;
  why_mentor: string;
};

const initial: FormState = {
  headline: "", bio: "", years_experience: "0", current_company: "", current_title: "",
  linkedin_url: "", website_url: "", portfolio_url: "", intro_video_url: "", why_mentor: "",
};

export function MentorApplicationForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/mentor/application", { cache: "no-store" }).then(async (response) => {
      if (response.status === 401) { window.location.href = "/login?next=/become-a-mentor"; return; }
      const result = await response.json();
      const app = result.application;
      if (app) {
        setStatus(app.status);
        setForm({
          headline: app.headline || "", bio: app.bio || "", years_experience: String(app.years_experience || 0),
          current_company: app.current_company || "", current_title: app.current_title || "",
          linkedin_url: app.linkedin_url || "", website_url: app.website_url || "",
          portfolio_url: app.portfolio_url || "", intro_video_url: app.intro_video_url || "", why_mentor: app.why_mentor || "",
        });
      }
      setLoading(false);
    }).catch(() => { setMessage("تعذر تحميل الطلب. حاول مرة أخرى."); setLoading(false); });
  }, []);

  function update(name: keyof FormState, value: string) { setForm((current) => ({ ...current, [name]: value })); }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setMessage("");
    const response = await fetch("/api/mentor/application", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok) { setStatus("submitted"); setMessage("تم إرسال طلبك للمراجعة بنجاح. سنحتفظ بأي تحديثات ترسلها لاحقًا."); }
    else setMessage(result.error === "headline_required" ? "اكتب المسمى أو الوصف المهني." : "تعذر إرسال الطلب. راجع البيانات وحاول مرة أخرى.");
    setSaving(false);
  }

  if (loading) return <div className="panel">جارٍ تحميل طلبك...</div>;

  const field = (label: string, name: keyof FormState, type = "text") => <label style={{display:"block",margin:"16px 0"}}>
    <b>{label}</b><input type={type} value={form[name]} onChange={(e) => update(name, e.target.value)} style={{display:"block",width:"100%",marginTop:6,padding:12,border:"1px solid #dbe5df",borderRadius:10}} />
  </label>;

  return <form className="panel" style={{maxWidth:820,marginBottom:80}} onSubmit={submit}>
    <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center"}}><h2 style={{margin:0}}>طلب الانضمام</h2>{status && <span className="availability">الحالة: {status}</span>}</div>
    <p className="muted">نراجع الخبرة يدويًا قبل تفعيل أي ملف خبير على المنصة.</p>
    {field("المسمى أو الوصف المهني *", "headline")}
    <label style={{display:"block",margin:"16px 0"}}><b>نبذة عن خبرتك</b><textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={5} style={{display:"block",width:"100%",marginTop:6,padding:12,border:"1px solid #dbe5df",borderRadius:10,font:"inherit"}} /></label>
    {field("سنوات الخبرة", "years_experience", "number")}
    {field("المسمى الوظيفي الحالي", "current_title")}
    {field("الشركة الحالية", "current_company")}
    {field("LinkedIn", "linkedin_url", "url")}
    {field("الموقع الشخصي", "website_url", "url")}
    {field("Portfolio", "portfolio_url", "url")}
    {field("فيديو تعريفي", "intro_video_url", "url")}
    <label style={{display:"block",margin:"16px 0"}}><b>لماذا تريد تقديم جلسات 1:1؟</b><textarea value={form.why_mentor} onChange={(e) => update("why_mentor", e.target.value)} rows={4} style={{display:"block",width:"100%",marginTop:6,padding:12,border:"1px solid #dbe5df",borderRadius:10,font:"inherit"}} /></label>
    {message && <p className="availability">{message}</p>}
    <button className="btn" disabled={saving}>{saving ? "جارٍ الإرسال..." : status ? "تحديث وإعادة إرسال الطلب" : "إرسال طلب المراجعة"}</button>
  </form>;
}
