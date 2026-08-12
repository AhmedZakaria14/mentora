import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const GOOGLE_OAUTH_SCOPES = {
  identity: ["openid", "email"],
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

export type GoogleFeature = keyof Omit<typeof GOOGLE_OAUTH_SCOPES, "identity">;

type OAuthStatePayload = {
  sub: string;
  nonce: string;
  returnTo: string;
  features: GoogleFeature[];
  iat: number;
};

function stateSecret() {
  const value = process.env.GOOGLE_OAUTH_STATE_SECRET;
  if (!value) throw new Error("GOOGLE_OAUTH_STATE_SECRET is missing");
  return value;
}

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

export function createOAuthState(input: Omit<OAuthStatePayload, "nonce" | "iat">) {
  const payload: OAuthStatePayload = {
    ...input,
    nonce: randomBytes(18).toString("base64url"),
    iat: Date.now(),
  };
  const encoded = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", stateSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyOAuthState(state: string): OAuthStatePayload {
  const [encoded, signature] = state.split(".");
  if (!encoded || !signature) throw new Error("Invalid OAuth state");
  const expected = createHmac("sha256", stateSecret()).update(encoded).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("Invalid OAuth state signature");
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as OAuthStatePayload;
  if (Date.now() - payload.iat > 10 * 60_000) throw new Error("OAuth state expired");
  return payload;
}

export function buildGoogleAuthorizationUrl(input: { state: string; features: GoogleFeature[] }) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) throw new Error("Google OAuth environment variables are missing");

  const scopes = new Set<string>(GOOGLE_OAUTH_SCOPES.identity);
  input.features.forEach((feature) => GOOGLE_OAUTH_SCOPES[feature].forEach((scope) => scopes.add(scope)));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    scope: [...scopes].join(" "),
    state: input.state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) throw new Error("Google OAuth environment variables are missing");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google token exchange failed: ${response.status}`);
  return response.json() as Promise<{
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
    id_token?: string;
  }>;
}

export async function fetchGoogleIdentity(accessToken: string) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google identity request failed: ${response.status}`);
  return response.json() as Promise<{ sub: string; email?: string; email_verified?: boolean }>;
}

export async function getValidGoogleAccessToken(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("google_connections")
    .select("access_token,refresh_token,expires_at")
    .eq("user_id", userId)
    .single();
  if (error || !data) throw new Error("Google account is not connected");

  const expiresAt = new Date(data.expires_at).getTime();
  if (expiresAt > Date.now() + 60_000) return data.access_token as string;
  if (!data.refresh_token) throw new Error("Google connection needs reauthorization");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Google OAuth environment variables are missing");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: data.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google token refresh failed: ${response.status}`);
  const refreshed = await response.json() as { access_token: string; expires_in: number; scope?: string; token_type?: string };

  const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  await admin.from("google_connections").update({
    access_token: refreshed.access_token,
    expires_at: newExpiresAt,
    token_type: refreshed.token_type ?? "Bearer",
    updated_at: new Date().toISOString(),
  }).eq("user_id", userId);

  return refreshed.access_token;
}
