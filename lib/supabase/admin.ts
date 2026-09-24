import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

export function createAdminClient() {
  const { url, serverKey: key } = getSupabaseConfig();
  if (!url || !key) throw new Error("Supabase is not configured. Add the required environment variables.");
  return createSupabaseClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
