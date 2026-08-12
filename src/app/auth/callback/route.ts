import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";
  const workspace = url.searchParams.get("workspace") === "1";
  const features = (url.searchParams.get("features") || "calendar,meet,chat")
    .split(",")
    .filter((value) => ["calendar", "meet", "chat"].includes(value));

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("OAuth callback exchange failed", error);
    return NextResponse.redirect(new URL("/login?error=oauth_callback", url.origin));
  }

  if (workspace) {
    const providerToken = data.session.provider_token;
    const providerRefreshToken = data.session.provider_refresh_token;

    if (!providerToken) {
      return NextResponse.redirect(new URL("/settings/integrations?google=missing_provider_token", url.origin));
    }

    const { error: storeError } = await supabase.rpc("store_google_provider_tokens", {
      p_access_token: providerToken,
      p_refresh_token: providerRefreshToken ?? null,
      p_features: features,
      p_scopes: [],
    });

    if (storeError) {
      console.error("Could not store Google provider tokens", storeError);
      return NextResponse.redirect(new URL("/settings/integrations?google=error", url.origin));
    }
  }

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const destination = new URL(safeNext, url.origin);
  if (workspace) destination.searchParams.set("google", "connected");
  return NextResponse.redirect(destination);
}
