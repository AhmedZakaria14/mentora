import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabasePublicConfig } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return NextResponse.json({ error: "session_required" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const response = await fetch(`${supabasePublicConfig.url}/functions/v1/google-workspace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apikey: supabasePublicConfig.publishableKey,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({ error: "workspace_response_error" }));
  return NextResponse.json(payload, { status: response.status });
}
