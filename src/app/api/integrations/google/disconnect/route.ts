import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data } = await admin.from("google_connections").select("access_token,refresh_token").eq("user_id", user.id).maybeSingle();
  const token = data?.refresh_token || data?.access_token;
  if (token) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      cache: "no-store",
    }).catch(() => undefined);
  }
  await admin.from("google_connections").delete().eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
