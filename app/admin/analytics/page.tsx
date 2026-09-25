import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin-nav";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  await requireAdmin();
  const db = createAdminClient();
  const [{ data: allPosts }, { data: views }] = await Promise.all([
    db.from("posts").select("id,status,category,language,view_count,title,slug").order("view_count", { ascending: false }),
    db.from("post_views").select("post_id,viewed_on"),
  ]);
  const posts = allPosts ?? [];
  const published = posts.filter((post) => post.status === "published");
  const statusCounts = new Map(["pending", "published", "rejected", "archived"].map((status) => [status, posts.filter((post) => post.status === status).length]));
  const categories = new Map<string, number>();
  const languages = new Map<string, number>();
  for (const post of published) {
    categories.set(post.category, (categories.get(post.category) ?? 0) + 1);
    languages.set(post.language, (languages.get(post.language) ?? 0) + 1);
  }
  const publicPostIds = new Set(published.map((post) => post.id));
  const days = new Map<string, number>();
  for (const row of views ?? []) {
    if (!publicPostIds.has(row.post_id)) continue;
    days.set(row.viewed_on, (days.get(row.viewed_on) ?? 0) + 1);
  }
  const recentDays = [...days.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
  const max = Math.max(1, ...recentDays.map((day) => day[1]));

  return <main className="admin-shell">
    <header className="admin-header"><div><span className="eyebrow">THE SCHOOL JOURNAL · ADMIN</span><h1>Reading the room</h1><p>Published readership and the full editorial pipeline.</p></div></header>
    <AdminNav active="Analytics"/>
    <section className="analytics-card status-summary" aria-label="Posts by editorial status"><span className="eyebrow">EDITORIAL PIPELINE</span><div className="status-summary-grid">{["pending", "published", "rejected", "archived"].map((status) => <div key={status}><span className={`status-pill status-${status}`}>{status}</span><b>{statusCounts.get(status) ?? 0}</b></div>)}</div></section>
    <div className="analytics-grid"><section className="analytics-card"><span className="eyebrow">DAILY READS · LAST 14 ACTIVE DAYS · PUBLISHED STORIES</span><div className="bar-chart">{recentDays.length ? recentDays.map(([day, count]) => <div key={day} title={`${day}: ${count} reads`}><span style={{ height: `${Math.max(5, count / max * 100)}%` }}/><small>{day.slice(5)}</small></div>) : <p>No view history yet.</p>}</div></section><section className="analytics-card"><span className="eyebrow">PUBLISHED POSTS BY CATEGORY</span>{[...categories].map(([name, count]) => <div className="metric-row" key={name}><span>{name}</span><b>{count}</b></div>)}</section><section className="analytics-card"><span className="eyebrow">PUBLISHED POSTS BY LANGUAGE</span>{[...languages].map(([name, count]) => <div className="metric-row" key={name}><span>{name}</span><b>{count}</b></div>)}</section><section className="analytics-card"><span className="eyebrow">MOST READ · PUBLISHED</span>{published.slice(0, 5).map((post, index) => <div className="metric-row" key={post.slug}><span>{String(index + 1).padStart(2,"0")} · {post.title}</span><b>{post.view_count}</b></div>)}</section></div>
  </main>;
}
