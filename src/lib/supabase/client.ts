import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicConfig } from "@/lib/supabase/config";

export function createClient() {
  return createBrowserClient(supabasePublicConfig.url, supabasePublicConfig.publishableKey);
}
