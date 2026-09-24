import Link from "next/link";
import { ArrowUpRight, BookOpen, Eye, Users } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin-nav";
import { formatDate } from "@/lib/utils";
import { categories } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const db = createAdminClient();
  const [postsRes, studentsRes, viewsRes, recentRes] = await Promise.all([
    db.from("posts").select("id", { count: "exact", head: true }),
    db.from("students").select("id", { count: "exact", head: true }),
    db.from("posts").select("view_count"),
    db.from("posts").select("id,slug,title,author_name,category,published_at,view_count").order("published_at", { ascending: false }).limit(6),
  ]);
  const totalViews = (viewsRes.data ?? []).reduce((sum, post) => sum + post.view_count, 0);
  const recent = recentRes.data ?? [];

  return <main className="admin-shell">
    <header className="admin-header admin-overview-header"><div><span className="eyebrow">THE SCHOOL JOURNAL · EDITORIAL DESK</span><h1>Good work, <em>in motion.</em></h1><p>A live view of the words and images our students are putting into the world.</p></div><Link href="/submit" className="editorial-desk-link">VIEW THE SUBMISSION PAGE <ArrowUpRight size={15}/></Link></header>
    <AdminNav active="Overview"/>
    <section className="admin-stats" aria-label="Magazine overview">
      <div><span><BookOpen size={14}/> LIVE STORIES</span><b>{postsRes.count ?? 0}</b><small>Published immediately</small></div>
      <div><span><Users size={14}/> STUDENT AUTHORS</span><b>{studentsRes.count ?? 0}</b><small>Across the journal</small></div>
      <div><span><Eye size={14}/> TOTAL READS</span><b>{totalViews.toLocaleString()}</b><small>Daily unique article reads</small></div>
      <div><span><span className="stat-spark">✳</span> CONTENT TYPES</span><b>{String(categories.length).padStart(2, "0")}</b><small>Ways to tell a story</small></div>
    </section>
    <section className="admin-section">
      <div className="admin-section-head"><div><span className="eyebrow">LATEST FROM THE COMMUNITY</span><h2>Recent activity<span>.</span></h2></div><Link href="/admin/posts" className="text-link">MANAGE STORIES <ArrowUpRight size={14}/></Link></div>
      {recent.length ? <div className="activity-list">{recent.map((post, index) => <article key={post.id} className="activity-row"><span className="activity-number">{String(index + 1).padStart(2, "0")}</span><span className="activity-dot"/><span className="activity-title"><Link href={`/articles/${post.slug}`}>{post.title}<ArrowUpRight size={13}/></Link><small>{post.author_name} <i/> {post.category}</small></span><span className="activity-date">{formatDate(post.published_at)}</span><b className="activity-reads">{post.view_count.toLocaleString()} <small>READS</small></b></article>)}</div> : <div className="admin-empty activity-empty"><span className="eyebrow">THE NEXT STORY STARTS HERE</span><h2>Quiet on the desk. Open in the journal.</h2><p>There are no published stories yet. The next student submission will appear here as soon as it goes live.</p><Link href="/submit" className="text-link">OPEN SUBMISSIONS <ArrowUpRight size={14}/></Link></div>}
    </section>
    <div className="admin-note"><span>NO APPROVAL QUEUE</span><p>Students publish their work immediately. The editorial desk is here to follow the conversation and remove content when necessary.</p></div>
  </main>;
}
