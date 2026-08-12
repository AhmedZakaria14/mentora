import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data, error } = await supabase
    .from("mentor_applications")
    .select("id,status,headline,bio,years_experience,current_company,current_title,linkedin_url,website_url,portfolio_url,intro_video_url,why_mentor,submitted_at,updated_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ application: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const payload = {
    headline: String(body.headline || "").trim(),
    bio: String(body.bio || "").trim(),
    years_experience: Number(body.years_experience || 0),
    current_company: String(body.current_company || "").trim(),
    current_title: String(body.current_title || "").trim(),
    linkedin_url: String(body.linkedin_url || "").trim(),
    website_url: String(body.website_url || "").trim(),
    portfolio_url: String(body.portfolio_url || "").trim(),
    intro_video_url: String(body.intro_video_url || "").trim(),
    why_mentor: String(body.why_mentor || "").trim(),
  };
  if (!payload.headline) return NextResponse.json({ error: "headline_required" }, { status: 422 });
  if (!Number.isFinite(payload.years_experience) || payload.years_experience < 0 || payload.years_experience > 80) {
    return NextResponse.json({ error: "invalid_years_experience" }, { status: 422 });
  }

  const { data, error } = await supabase.rpc("submit_mentor_application", { p_data: payload });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, applicationId: data });
}
