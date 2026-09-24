import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await createClient(); const { data: { user } } = await auth.auth.getUser();
  if (!user || user.app_metadata.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = createAdminClient();
  const { data: post } = await db.from("posts").select("cover_image,student_id").eq("id", id).maybeSingle();
  const { error } = await db.from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not remove the post." }, { status: 500 });
  if (post?.cover_image) { const path = post.cover_image.split("/magazine-covers/").pop(); if (path) await db.storage.from("magazine-covers").remove([path]); }
  if (post?.student_id) { const { count } = await db.from("posts").select("id", { count: "exact", head: true }).eq("student_id", post.student_id); if (count === 0) await db.from("students").delete().eq("id", post.student_id); }
  return NextResponse.json({ ok: true });
}
