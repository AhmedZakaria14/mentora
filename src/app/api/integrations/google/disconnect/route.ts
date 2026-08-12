import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login?next=/settings/integrations", request.url));

  const { data: token } = await supabase.rpc("get_valid_google_access_token");
  if (typeof token === "string" && token) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      cache: "no-store",
    }).catch(() => undefined);
  }

  await supabase.rpc("disconnect_google_connection");
  const returnToRaw = request.nextUrl.searchParams.get("returnTo") || "/settings/integrations";
  const returnTo = returnToRaw.startsWith("/") && !returnToRaw.startsWith("//") ? returnToRaw : "/settings/integrations";
  const redirect = new URL(returnTo, request.url);
  redirect.searchParams.set("google", "disconnected");
  return NextResponse.redirect(redirect);
}
