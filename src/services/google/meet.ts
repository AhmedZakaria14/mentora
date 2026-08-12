const meetBase = "https://meet.googleapis.com/v2";

export async function listConferenceParticipants(accessToken: string, conferenceRecordName: string) {
  const response = await fetch(`${meetBase}/${conferenceRecordName}/participants`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Google Meet participants request failed: ${response.status}`);
  return response.json();
}

export async function listConferenceTranscripts(accessToken: string, conferenceRecordName: string) {
  const response = await fetch(`${meetBase}/${conferenceRecordName}/transcripts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Google Meet transcripts request failed: ${response.status}`);
  return response.json();
}
