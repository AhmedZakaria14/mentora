import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const scopesByFeature = {
  calendar: [
    "https://www.googleapis.com/auth/calendar.freebusy",
    "https://www.googleapis.com/auth/calendar.events",
  ],
  meet: ["https://www.googleapis.com/auth/meetings.space.readonly"],
  chat: [
    "https://www.googleapis.com/auth/chat.spaces",
    "https://www.googleapis.com/auth/chat.messages.create",
    "https://www.googleapis.com/auth/chat.memberships",
  ],
} as const;

type GoogleFeature = keyof typeof scopesByFeature;
const allowed = new Set<GoogleFeature>(["calendar", "meet", "chat"]);

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const next = "/settings/integrations";
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.url));
  }

  const requested = (request.nextUrl.searchParams.get("features") || "calendar,meet,chat")
    .split(",")
    .filter((value): value is GoogleFeature => allowed.has(value as GoogleFeature));
  const features: GoogleFeature[] = requested.length ? requested : ["calendar"];
  const returnToRaw = request.nextUrl.searchParams.get("returnTo") || "/settings/integrations";
  const returnTo = returnToRaw.startsWith("/") && !returnToRaw.startsWith("//")
    ? returnToRaw
    : "/settings/integrations";

  const scopes = [...new Set(features.flatMap((feature) => scopesByFeature[feature]))];
  const callback = new URL("/auth/callback", request.url);
  callback.searchParams.set("next", returnTo);
  callback.searchParams.set("workspace", "1");
  callback.searchParams.set("features", features.join(","));
  callback.searchParams.set("scopes", scopes.join(","));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callback.toString(),
      scopes: scopes.join(" "),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
      },
    },
  });

  if (error || !data.url) {
    console.error("Workspace OAuth start failed", error);
    return NextResponse.redirect(new URL("/settings/integrations?google=error", request.url));
  }

  return NextResponse.redirect(data.url);
}
