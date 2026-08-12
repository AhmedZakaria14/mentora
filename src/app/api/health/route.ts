import { NextResponse } from "next/server";
import { supabasePublicConfig } from "@/lib/supabase/config";

export async function GET() {
  let googleProvider = false;
  let authReachable = false;

  try {
    const response = await fetch(`${supabasePublicConfig.url}/auth/v1/settings`, {
      headers: { apikey: supabasePublicConfig.publishableKey },
      cache: "no-store",
    });
    authReachable = response.ok;
    if (response.ok) {
      const settings = await response.json() as { external?: Record<string, boolean> };
      googleProvider = settings.external?.google === true;
    }
  } catch {
    authReachable = false;
  }

  const checks = {
    supabaseConfigured: Boolean(supabasePublicConfig.url && supabasePublicConfig.publishableKey),
    supabaseAuthReachable: authReachable,
    googleProviderEnabled: googleProvider,
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
