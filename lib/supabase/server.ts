import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";

export async function createClient() {
  const config = getSupabaseConfig();
  if (!isSupabaseConfigured() || !config.url || !config.publishableKey) throw new Error("Supabase is not configured. Set the project URL and publishable key.");
  const cookieStore = await cookies();
  return createServerClient(config.url, config.publishableKey, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => { try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} } },
  });
}

export { isSupabaseConfigured };
