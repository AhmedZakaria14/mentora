import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const calendarBase = "https://www.googleapis.com/calendar/v3";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function asString(value: unknown, name: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name}_required`);
  return value.trim();
}

function asEmailList(value: unknown) {
  if (value == null) return [] as string[];
  if (!Array.isArray(value) || value.length > 20) throw new Error("invalid_attendees");
  return value.map((v) => asString(v, "attendee_email"));
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRole) return json({ error: "server_configuration_error" }, 500);

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return json({ error: "unauthorized" }, 401);

  const admin = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: accessToken, error: tokenError } = await admin.rpc(
    "get_valid_google_access_token_for_user",
    { p_user: user.id },
  );
  if (tokenError || !accessToken) {
    const message = tokenError?.message || "google_not_connected";
    return json({ error: message.includes("reauthorization") ? "google_reauthorization_required" : "google_not_connected" }, 409);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const action = body.action;
  try {
    if (action === "freebusy") {
      const timeMin = asString(body.timeMin, "time_min");
      const timeMax = asString(body.timeMax, "time_max");
      const calendarIds = body.calendarIds == null ? ["primary"] : body.calendarIds;
      if (!Array.isArray(calendarIds) || calendarIds.length < 1 || calendarIds.length > 10) {
        return json({ error: "invalid_calendar_ids" }, 400);
      }
      const ids = calendarIds.map((id) => asString(id, "calendar_id"));
      const response = await fetch(`${calendarBase}/freeBusy`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ timeMin, timeMax, items: ids.map((id) => ({ id })) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return json({ error: "google_calendar_freebusy_failed", status: response.status }, 502);
      const busy = Object.entries((data as any).calendars ?? {}).flatMap(([calendarId, calendar]: any) =>
        (calendar?.busy ?? []).map((range: any) => ({ calendarId, start: range.start, end: range.end }))
      );
      return json({ busy });
    }

    if (action === "create_event") {
      const summary = asString(body.summary, "summary");
      const startIso = asString(body.startIso, "start_iso");
      const endIso = asString(body.endIso, "end_iso");
      const timeZone = typeof body.timeZone === "string" && body.timeZone.trim() ? body.timeZone.trim() : "Africa/Cairo";
      const calendarId = typeof body.calendarId === "string" && body.calendarId.trim() ? body.calendarId.trim() : "primary";
      const attendeeEmails = asEmailList(body.attendeeEmails);
      const description = typeof body.description === "string" ? body.description : undefined;
      const requestId = typeof body.requestId === "string" && body.requestId.trim() ? body.requestId.trim() : crypto.randomUUID();

      const response = await fetch(`${calendarBase}/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          description,
          start: { dateTime: startIso, timeZone },
          end: { dateTime: endIso, timeZone },
          attendees: attendeeEmails.map((email) => ({ email })),
          conferenceData: {
            createRequest: {
              requestId,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      });
      const data: any = await response.json().catch(() => ({}));
      if (!response.ok) return json({ error: "google_calendar_event_creation_failed", status: response.status }, 502);
      const meetUrl = data.hangoutLink || data.conferenceData?.entryPoints?.find((x: any) => x.entryPointType === "video")?.uri || null;
      return json({
        event: {
          id: data.id,
          status: data.status,
          htmlLink: data.htmlLink,
          meetUrl,
          start: data.start,
          end: data.end,
        },
      });
    }

    return json({ error: "unsupported_action" }, 400);
  } catch (error) {
    console.error("google-workspace error", error);
    return json({ error: error instanceof Error ? error.message : "unexpected_error" }, 400);
  }
});
