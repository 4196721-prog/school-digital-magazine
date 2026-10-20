import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin-nav";
import { AdminSubmissionQueue } from "@/components/admin-submission-queue";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  const db = createAdminClient();
  const { data, error } = await db.from("posts").select("*").eq("status", "pending").order("submitted_at", { ascending: true });
  if (error) throw new Error("Could not load pending submissions.");
  const rows = data ?? [];
  const originalResult = rows.length
    ? await db.from("post_submission_originals").select("post_id,original_submission").in("post_id", rows.map((post) => post.id))
    : { data: [], error: null };
  if (originalResult.error) throw new Error("Could not load original student submissions.");
  const originalByPost = new Map((originalResult.data ?? []).map((entry) => [entry.post_id, entry.original_submission]));
  const posts = rows.map((post) => ({ ...post, original_submission: originalByPost.get(post.id) ?? null })) as Post[];

  return <main className="admin-shell">
    <header className="admin-header"><div><span className="eyebrow">THE SCHOOL JOURNAL · EDITORIAL DESK</span><h1>Pending submissions<span className="admin-heading-period">.</span></h1><p>Read each student’s work before deciding whether to publish it.</p></div><div className="admin-count-mark"><b>{String(posts.length).padStart(2, "0")}</b><span>WAITING</span></div></header>
    <AdminNav active="Pending"/>
    <AdminSubmissionQueue posts={posts}/>
  </main>;
}
