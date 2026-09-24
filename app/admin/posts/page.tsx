import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin-nav";
import { AdminPostTable } from "@/components/admin-post-table";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; language?: string; from?: string; to?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const db = createAdminClient();
  let query = db.from("posts").select("*").order("published_at", { ascending: false });
  if (params.q) { const term = params.q.replace(/[,%()]/g, " ").trim().slice(0, 100); query = query.or(`title.ilike.%${term}%,author_name.ilike.%${term}%`); }
  if (params.category) query = query.eq("category", params.category);
  if (params.language) query = query.eq("language", params.language);
  if (params.from && /^\d{4}-\d{2}-\d{2}$/.test(params.from)) query = query.gte("published_at", `${params.from}T00:00:00.000Z`);
  if (params.to && /^\d{4}-\d{2}-\d{2}$/.test(params.to)) query = query.lte("published_at", `${params.to}T23:59:59.999Z`);
  const { data } = await query.limit(200);

  return <main className="admin-shell">
    <header className="admin-header"><div><span className="eyebrow">THE SCHOOL JOURNAL · EDITORIAL DESK</span><h1>Published stories<span className="admin-heading-period">.</span></h1><p>Every student voice, in one place.</p></div><Link href="/submit" className="text-link">OPEN SUBMISSIONS <ArrowUpRight size={14}/></Link></header>
    <AdminNav active="Posts"/>
    <form className="admin-filter" aria-label="Filter published stories">
      <label className="filter-search">Find a story<input name="q" placeholder="Title or student name" defaultValue={params.q}/></label>
      <label>Category<select name="category" defaultValue={params.category ?? ""}><option value="">All categories</option>{["Articles","Blogs","Poetry","Stories","Artwork","Photography","School Activities","Achievements"].map((category) => <option key={category}>{category}</option>)}</select></label>
      <label>Language<select name="language" defaultValue={params.language ?? ""}><option value="">Every language</option><option>English</option><option>Urdu</option></select></label>
      <label>From<input type="date" name="from" defaultValue={params.from}/></label>
      <label>To<input type="date" name="to" defaultValue={params.to}/></label>
      <button>Apply filters <ArrowUpRight size={14}/></button>
    </form>
    <AdminPostTable posts={(data ?? []) as Post[]}/>
  </main>;
}
