import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabasePublishableKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    supabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    googleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
    googleClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    googleRedirectUri: Boolean(process.env.GOOGLE_REDIRECT_URI),
    googleStateSecret: Boolean(process.env.GOOGLE_OAUTH_STATE_SECRET),
  };
  const ready = Object.values(checks).every(Boolean);
  return NextResponse.json({
    ok: true,
    service: "mentora",
    readiness: ready ? "ready" : "configuration_required",
    checks,
    time: new Date().toISOString(),
  });
}
