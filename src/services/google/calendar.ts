export interface CalendarBusyRange { start: string; end: string }

const calendarBase = "https://www.googleapis.com/calendar/v3";

export async function getGoogleBusyTimes(accessToken: string, calendarIds: string[], timeMin: string, timeMax: string): Promise<CalendarBusyRange[]> {
  const response = await fetch(`${calendarBase}/freeBusy`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin, timeMax, items: calendarIds.map((id) => ({ id })) }),
  });
  if (!response.ok) throw new Error(`Google Calendar free/busy failed: ${response.status}`);
  const data = await response.json();
  return Object.values(data.calendars ?? {}).flatMap((calendar: any) => calendar.busy ?? []);
}

export async function createCalendarEventWithMeet(accessToken: string, input: {
  calendarId?: string;
  summary: string;
  description?: string;
  startIso: string;
  endIso: string;
  timeZone: string;
  attendeeEmails: string[];
  requestId: string;
}) {
  const calendarId = encodeURIComponent(input.calendarId || "primary");
  const response = await fetch(`${calendarBase}/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.startIso, timeZone: input.timeZone },
      end: { dateTime: input.endIso, timeZone: input.timeZone },
      attendees: input.attendeeEmails.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: input.requestId,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }),
  });
  if (!response.ok) throw new Error(`Google Calendar event creation failed: ${response.status}`);
  return response.json();
}
