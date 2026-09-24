import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Editorial sign in is unavailable until Supabase is connected." }, { status: 503 });
  const form = await request.formData(); const email = String(form.get("email") ?? ""); const password = String(form.get("password") ?? "");
  if (!email || !password || email.length > 254 || password.length > 256) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  const supabase = await createClient(); const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || data.user.app_metadata.role !== "admin") { if (!error) await supabase.auth.signOut(); return NextResponse.json({ error: "Those details don't match an admin account." }, { status: 401 }); }
  return NextResponse.json({ ok: true });
}
