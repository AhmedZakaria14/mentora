import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { exchangeGoogleCode, fetchGoogleIdentity, verifyOAuthState } from "@/services/google/oauth";

export async function GET(request: NextRequest) {
  const errorParam = request.nextUrl.searchParams.get("error");
  if (errorParam) return NextResponse.redirect(new URL(`/settings/integrations?google=denied`, request.url));

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !state) return NextResponse.json({ error: "Missing OAuth callback parameters" }, { status: 400 });

  try {
    const statePayload = verifyOAuthState(state);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== statePayload.sub) throw new Error("Authenticated user does not match OAuth state");

    const token = await exchangeGoogleCode(code);
    const identity = await fetchGoogleIdentity(token.access_token);
    const admin = createAdminClient();
    const { data: existing } = await admin.from("google_connections").select("refresh_token").eq("user_id", user.id).maybeSingle();
    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();

    const { error } = await admin.from("google_connections").upsert({
      user_id: user.id,
      google_subject: identity.sub,
      google_email: identity.email ?? null,
      access_token: token.access_token,
      refresh_token: token.refresh_token ?? existing?.refresh_token ?? null,
      expires_at: expiresAt,
      token_type: token.token_type ?? "Bearer",
      granted_scopes: token.scope?.split(" ") ?? [],
      enabled_features: statePayload.features,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) throw error;

    const redirect = new URL(statePayload.returnTo, request.url);
    redirect.searchParams.set("google", "connected");
    return NextResponse.redirect(redirect);
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    return NextResponse.redirect(new URL("/settings/integrations?google=error", request.url));
  }
}
