type SupabaseConfig = { url?: string; publishableKey?: string; serverKey?: string };

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      || process.env.SUPABASE_PUBLISHABLE_KEY
      || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serverKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function hasRealValue(value?: string) {
  const normalized = value?.trim();
  return Boolean(normalized && !/^your[-_]/i.test(normalized) && !/your-project\.supabase\.co/i.test(normalized) && !/^<.*>$/.test(normalized));
}

export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return hasRealValue(config.url) && hasRealValue(config.publishableKey) && hasRealValue(config.serverKey);
}
