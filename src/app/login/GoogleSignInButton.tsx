"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "167963758304-mm6cqpavp9jlcjdrcr7opm276ssqlmvs.apps.googleusercontent.com";

type GoogleCredentialResponse = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function createNoncePair() {
  const raw = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return { raw, hashed: bytesToHex(new Uint8Array(digest)) };
}

export function GoogleSignInButton({ next = "/dashboard" }: { next?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function setupGoogleButton() {
    if (!window.google || !containerRef.current) return;
    const nonce = await createNoncePair();

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      nonce: nonce.hashed,
      use_fedcm_for_prompt: true,
      callback: async (response: GoogleCredentialResponse) => {
        if (!response.credential) {
          setStatus("error");
          return;
        }

        setStatus("loading");
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
          nonce: nonce.raw,
        });

        if (error) {
          console.error("Google ID token sign-in failed", error);
          setStatus("error");
          return;
        }

        router.replace(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
        router.refresh();
      },
    });

    containerRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      width: 360,
    });
  }

  return (
    <div className="googleSignInWrap">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={setupGoogleButton} />
      <div ref={containerRef} className="googleButtonHost" aria-label="المتابعة باستخدام Google" />
      {status === "loading" ? <p className="loginStatus">جارٍ تسجيل الدخول بأمان…</p> : null}
      {status === "error" ? (
        <p className="notice error">تعذر إكمال تسجيل Google. تحقق من إعداد Authorized JavaScript origins ثم حاول مرة أخرى.</p>
      ) : null}
      <a className="loginFallback" href={`/auth/google?next=${encodeURIComponent(next)}`}>استخدام طريقة OAuth البديلة</a>
    </div>
  );
}
