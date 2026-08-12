import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildGoogleAuthorizationUrl, createOAuthState, type GoogleFeature } from "@/services/google/oauth";

const allowed = new Set<GoogleFeature>(["calendar", "meet", "chat"]);
const defaultFeatures: GoogleFeature[] = ["calendar"];

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const requested: GoogleFeature[] = (request.nextUrl.searchParams.get("features") || "calendar,meet,chat")
    .split(",")
    .filter((value): value is GoogleFeature => allowed.has(value as GoogleFeature));
  const features: GoogleFeature[] = requested.length ? requested : defaultFeatures;
  const returnToRaw = request.nextUrl.searchParams.get("returnTo") || "/settings/integrations";
  const returnTo = returnToRaw.startsWith("/") && !returnToRaw.startsWith("//") ? returnToRaw : "/settings/integrations";
  const state = createOAuthState({ sub: user.id, returnTo, features });
  return NextResponse.redirect(buildGoogleAuthorizationUrl({ state, features }));
}
