import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
export async function requireAdmin() { if (!isSupabaseConfigured()) redirect("/admin/login"); const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user || user.app_metadata.role !== "admin") redirect("/admin/login"); return user; }
