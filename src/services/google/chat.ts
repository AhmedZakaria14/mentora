const chatBase = "https://chat.googleapis.com/v1";

export async function createMentorshipSpace(accessToken: string, displayName: string) {
  const response = await fetch(`${chatBase}/spaces`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ displayName, spaceType: "SPACE" }),
  });
  if (!response.ok) throw new Error(`Google Chat space creation failed: ${response.status}`);
  return response.json();
}

export async function sendChatMessage(accessToken: string, spaceName: string, text: string) {
  const response = await fetch(`${chatBase}/${spaceName}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error(`Google Chat message failed: ${response.status}`);
  return response.json();
}
