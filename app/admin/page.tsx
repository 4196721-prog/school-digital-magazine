import Link from "next/link";
import { ArrowUpRight, BookOpen, Eye, Users, Hourglass } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin-nav";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const db = createAdminClient();
  const [{ data: posts }, { data: students }] = await Promise.all([
    db.from("posts").select("id,student_id,slug,title,author_name,category,published_at,view_count,status"),
    db.from("students").select("id"),
  ]);
  const allPosts = posts ?? [];
  const published = allPosts.filter((post) => post.status === "published");
  const pendingCount = allPosts.filter((post) => post.status === "pending").length;
  const liveAuthors = new Set(published.map((post) => post.student_id)).size;
  const totalViews = published.reduce((sum, post) => sum + post.view_count, 0);
  const recent = [...published].sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at)).slice(0, 6);

  return <main className="admin-shell">
    <header className="admin-header admin-overview-header"><div><span className="eyebrow">THE SCHOOL JOURNAL · EDITORIAL DESK</span><h1>Good work, <em>in motion.</em></h1><p>A live view of the words and images our students are putting into the world.</p></div><Link href="/submit" className="editorial-desk-link">VIEW THE SUBMISSION PAGE <ArrowUpRight size={15}/></Link></header>
    <AdminNav active="Overview"/>
    <section className="admin-stats" aria-label="Magazine overview">
      <div><span><BookOpen size={14}/> LIVE STORIES</span><b>{published.length}</b><small>Approved and public</small></div>
      <div><span><Hourglass size={14}/> PENDING REVIEW</span><b>{pendingCount}</b><small><Link href="/admin/submissions">Open submissions desk</Link></small></div>
      <div><span><Users size={14}/> STUDENT AUTHORS</span><b>{liveAuthors}</b><small>{students?.length ?? 0} student records</small></div>
      <div><span><Eye size={14}/> TOTAL READS</span><b>{totalViews.toLocaleString()}</b><small>Daily unique article reads</small></div>
    </section>
    <section className="admin-section">
      <div className="admin-section-head"><div><span className="eyebrow">LATEST FROM THE COMMUNITY</span><h2>Recent activity<span>.</span></h2></div><Link href="/admin/posts" className="text-link">MANAGE STORIES <ArrowUpRight size={14}/></Link></div>
      {recent.length ? <div className="activity-list">{recent.map((post, index) => <article key={post.id} className="activity-row"><span className="activity-number">{String(index + 1).padStart(2, "0")}</span><span className="activity-dot"/><span className="activity-title"><Link href={`/articles/${post.slug}`}>{post.title}<ArrowUpRight size={13}/></Link><small>{post.author_name} <i/> {post.category}</small></span><span className="activity-date">{formatDate(post.published_at)}</span><b className="activity-reads">{post.view_count.toLocaleString()} <small>READS</small></b></article>)}</div> : <div className="admin-empty activity-empty"><span className="eyebrow">THE NEXT STORY STARTS HERE</span><h2>Quiet on the desk. Open in the journal.</h2><p>Approved student stories will appear here.</p><Link href="/admin/submissions" className="text-link">REVIEW SUBMISSIONS <ArrowUpRight size={14}/></Link></div>}
    </section>
    <div className="admin-note"><span>EDITORIAL REVIEW</span><p>Every student submission waits for an editor’s decision. Approved stories publish immediately; rejected and archived work stays in the private post library.</p></div>
  </main>;
}
